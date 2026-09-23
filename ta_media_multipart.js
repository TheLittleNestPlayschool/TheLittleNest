const MEDIA_MULTIPART_COMPLETE_API='https://x58r-xped-p4y6.n7e.xano.io/api:EpDLPKN0/ta_media_multipart_complete';
const MEDIA_MULTIPART_ABORT_API='https://x58r-xped-p4y6.n7e.xano.io/api:EpDLPKN0/ta_media_multipart_abort';
const DEFAULT_PART_SIZE=10*1024*1024;
const MAX_PART_ATTEMPTS=3;

export function isMultipartUploadTarget(target){
return Boolean(target?.upload_type==='multipart'&&target?.upload_id&&target?.file_key&&Array.isArray(target?.parts)&&target.parts.length);
}

export async function uploadMultipartFile(file,target,state,{onProgress}={}){
if(!file||!isMultipartUploadTarget(target))throw new Error('Multipart upload information is incomplete.');
const partSize=Number(target.part_size)||DEFAULT_PART_SIZE;
const signedParts=[...target.parts].sort((a,b)=>Number(a?.part_number)-Number(b?.part_number));
const completedParts=[];
try{
for(let index=0;index<signedParts.length;index+=1){
const signedPart=signedParts[index];
const partNumber=Number(signedPart?.part_number)||index+1;
const signedUrl=signedPart?.signed_url||'';
if(!signedUrl)throw new Error(`Missing upload URL for video part ${partNumber}.`);
const start=(partNumber-1)*partSize;
const end=Math.min(start+partSize,file.size);
const blob=file.slice(start,end);
if(typeof onProgress==='function')onProgress({partNumber,index:index+1,totalParts:signedParts.length});
const etag=await uploadPartWithRetry(blob,signedUrl,partNumber);
completedParts.push({part_number:partNumber,etag});
}
await completeMultipartUpload(target,completedParts,state);
return true;
}catch(error){
await abortMultipartUpload(target,state);
throw error;
}
}

async function uploadPartWithRetry(blob,signedUrl,partNumber){
let lastError=null;
for(let attempt=1;attempt<=MAX_PART_ATTEMPTS;attempt+=1){
try{
const response=await fetch(signedUrl,{method:'PUT',body:blob});
if(!response.ok)throw new Error(`AWS video part ${partNumber} failed with status ${response.status}.`);
const etag=response.headers.get('ETag')||response.headers.get('etag');
if(!etag)throw new Error('AWS uploaded the video part but did not expose its ETag. Add ETag to the S3 CORS ExposeHeaders setting.');
return etag;
}catch(error){
lastError=error;
if(String(error?.message||'').includes('did not expose its ETag'))break;
if(attempt<MAX_PART_ATTEMPTS)await wait(700*attempt);
}
}
throw lastError||new Error(`Unable to upload video part ${partNumber}.`);
}

async function completeMultipartUpload(target,parts,state){
const response=await fetch(MEDIA_MULTIPART_COMPLETE_API,{method:'POST',headers:{...buildRequestHeaders(state),'Content-Type':'application/json'},body:JSON.stringify({file_key:target.file_key,upload_id:target.upload_id,parts})});
const data=await readResponseData(response);
if(!response.ok)throw new Error(getApiErrorMessage(data,'Unable to complete large video upload.'));
return data;
}

async function abortMultipartUpload(target,state){
if(!target?.file_key||!target?.upload_id)return;
try{
await fetch(MEDIA_MULTIPART_ABORT_API,{method:'POST',headers:{...buildRequestHeaders(state),'Content-Type':'application/json'},body:JSON.stringify({file_key:target.file_key,upload_id:target.upload_id})});
}catch(error){
console.warn('Unable to abort multipart media upload:',error);
}
}

function buildRequestHeaders(state){
const headers={Accept:'application/json'};
const authToken=state?.authToken||state?.auth_token||state?.context?.authToken||state?.context?.auth_token||window.localStorage.getItem('authToken')||window.localStorage.getItem('auth_token')||'';
if(authToken)headers.Authorization=`Bearer ${authToken}`;
return headers;
}

async function readResponseData(response){
const text=await response.text();
if(!text)return null;
try{return JSON.parse(text);}catch(error){return{message:text};}
}

function getApiErrorMessage(data,fallback){return data?.message||data?.error||fallback;}
function wait(ms){return new Promise(resolve=>window.setTimeout(resolve,ms));}
