const MEDIA_SESSION_API=
'https://x8ki-letl-twmt.n7.xano.io/api:EpDLPKN0/ta_get_session';

const MEDIA_TASK_API=
'https://x8ki-letl-twmt.n7.xano.io/api:EpDLPKN0/ta_get_media_task';

const MEDIA_PREPARE_UPLOAD_API=
'https://x8ki-letl-twmt.n7.xano.io/api:EpDLPKN0/ta_prepare_media_upload';

const MEDIA_SAVE_API=
'https://x8ki-letl-twmt.n7.xano.io/api:EpDLPKN0/ta_save_media';

export async function loadMediaSessions(
state
){
const response=
await fetch(
MEDIA_SESSION_API,
{
method:'GET',
headers:
buildRequestHeaders(
state
)
}
);

const responseData=
await readResponseData(
response
);

if(!response.ok){
throw new Error(
getApiErrorMessage(
responseData,
'Unable to load sessions.'
)
);
}

return{
sessions:
Array.isArray(
responseData?.sessions
)
?responseData.sessions
:[]
};
}

export async function loadMediaTaskData(
sessionId,
state
){
const url=
new URL(
MEDIA_TASK_API
);

url.searchParams.set(
'session_id',
sessionId
);

const response=
await fetch(
url.toString(),
{
method:'GET',
headers:
buildRequestHeaders(
state
)
}
);

const responseData=
await readResponseData(
response
);

if(!response.ok){
throw new Error(
getApiErrorMessage(
responseData,
'Unable to load media task.'
)
);
}

return{
user:
responseData?.user||
null,

studentsBySession:
Array.isArray(
responseData
?.students_by_session
)
?responseData
.students_by_session
:[],

studentsByLocation:
Array.isArray(
responseData
?.students_by_location
)
?responseData
.students_by_location
:(
Array.isArray(
responseData
?.student_by_location
)
?responseData
.student_by_location
:[]
)
};
}

/*  Prepare Media Upload Batch */

export async function prepareMediaUpload(
manifest,
state
){
const mediaItems=
buildPrepareMediaItems(
manifest
);

if(!mediaItems.length){
throw new Error(
'No media items are available to prepare.'
);
}

const response=
await fetch(
MEDIA_PREPARE_UPLOAD_API,
{
method:'POST',

headers:{
...buildRequestHeaders(
state
),
'Content-Type':
'application/json'
},

body:
JSON.stringify({
media_items:
mediaItems
})
}
);

const responseData=
await readResponseData(
response
);

if(!response.ok){
throw new Error(
getApiErrorMessage(
responseData,
'Unable to prepare media upload.'
)
);
}

return{
uploadTargets:
Array.isArray(
responseData?.upload_targets
)
?responseData.upload_targets
:[],

mediaRecords:
Array.isArray(
responseData?.media_records
)
?responseData.media_records
:[]
};
}

/*  Save Media Records Batch */

export async function saveMediaRecords(
mediaRecords,
state
){
if(
!Array.isArray(
mediaRecords
)||
!mediaRecords.length
){
throw new Error(
'No media records are available to save.'
);
}

const response=
await fetch(
MEDIA_SAVE_API,
{
method:'POST',

headers:{
...buildRequestHeaders(
state
),
'Content-Type':
'application/json'
},

body:
JSON.stringify({
media_records:
mediaRecords
})
}
);

const responseData=
await readResponseData(
response
);

if(!response.ok){
throw new Error(
getApiErrorMessage(
responseData,
'Unable to save media records.'
)
);
}

return responseData;
}

/*  Prepare Payload */

function buildPrepareMediaItems(
manifest
){
if(
!Array.isArray(
manifest
)
){
return[];
}

return manifest.map(
item=>{
return{
session_id:
item.sessionId,

student_ids:
Array.isArray(
item.studentIds
)
?item.studentIds
:[],

file_name:
item.file?.name||
'',

content_type:
item.file?.type||
'',

media_type:
item.mediaType||
'',

media_kind:
item.mediaKind||
'',

media_group_id:
item.clientMediaId||
item.id||
'',

file_size:
Number(
item.file?.size||
0
)
};
}
);
}

/*  Request Headers */

function buildRequestHeaders(
state
){
const headers={
Accept:
'application/json'
};

const authToken=
getAuthToken(
state
);

if(authToken){
headers.Authorization=
`Bearer ${authToken}`;
}

return headers;
}

function getAuthToken(
state
){
return(
state?.authToken||
state?.auth_token||
state?.context?.authToken||
state?.context?.auth_token||
window.localStorage.getItem(
'authToken'
)||
window.localStorage.getItem(
'auth_token'
)||
''
);
}

/*  Response Helpers */

async function readResponseData(
response
){
const responseText=
await response.text();

if(!responseText){
return null;
}

try{
return JSON.parse(
responseText
);

}catch(error){
return{
message:
responseText
};
}
}

function getApiErrorMessage(
responseData,
fallbackMessage
){
return(
responseData?.message||
responseData?.error||
fallbackMessage
);
}
