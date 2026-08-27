import{
getModule
}from'./ta_module_registry.js';

const STANDARD_LAYOUT_MODE=
'standard';

/*  Build Stage Plan */

export function buildStagePlan(
priorityList
){
const normalizedPriorityList=
Array.isArray(priorityList)
?priorityList
:[];

/*  Remove Hidden Modules */

const visiblePriorityList=
normalizedPriorityList.filter(
priorityItem=>{
const moduleId=
getPriorityItemId(
priorityItem
);

const module=
getModule(
moduleId
);

return(
module&&
module.isVisible!==false
);
}
);

/*  Build Visible Modules */

const modules=
visiblePriorityList.map(
(priorityItem,index)=>{
const modulePlan=
normalizePriorityItem(
priorityItem
);

return{
...modulePlan,
state:
index===0
?'active'
:'collapsed'
};
}
);

return{
context:null,
layoutMode:
STANDARD_LAYOUT_MODE,
modules
};
}

/*  Get Priority Item ID */

function getPriorityItemId(
priorityItem
){
if(
typeof priorityItem===
'string'
){
return priorityItem;
}

if(
priorityItem&&
typeof priorityItem===
'object'
){
return priorityItem.id||'';
}

return String(
priorityItem||
''
);
}

/*  Normalize Priority Item */

function normalizePriorityItem(
priorityItem
){
if(
typeof priorityItem===
'string'
){
return{
id:priorityItem
};
}

if(
priorityItem&&
typeof priorityItem===
'object'&&
priorityItem.id
){
return{
...priorityItem
};
}

return{
id:String(
priorityItem||
''
)
};
}
