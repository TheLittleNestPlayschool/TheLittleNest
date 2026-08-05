/*==================================================
  Attendance Module
==================================================*/
.attendance-experience{
    width:100%;
    max-width:680px;
    margin:0 auto;
    display:flex;
    flex-direction:column;
    gap:14px;
}
.attendance-eyebrow{
    margin:0;
    color:#92400e;
    font-size:.72rem;
    font-weight:800;
    letter-spacing:.07em;
    text-transform:uppercase;
}
.attendance-experience-title{
    margin:0;
    color:#0f172a;
    font-size:1.35rem;
    font-weight:900;
    line-height:1.2;
}
.attendance-experience-description{
    margin:0;
    color:#475569;
    font-size:.9rem;
    font-weight:600;
    line-height:1.45;
}
.attendance-empty-message{
    margin:0;
    padding:12px 14px;
    background:rgba(255,255,255,.24);
    border:1px solid rgba(255,255,255,.38);
    border-radius:13px;
    color:#475569;
    font-size:.86rem;
    font-weight:600;
    line-height:1.4;
}
.attendance-primary-button,
.attendance-secondary-button,
.attendance-text-button,
.attendance-review-choice,
.attendance-remove-button{
    font:inherit;
}
.attendance-primary-button{
    width:100%;
    min-height:48px;
    padding:11px 16px;
    background:linear-gradient(135deg,#d4a017,#f0c04a);
    border:1px solid rgba(120,74,0,.26);
    border-radius:13px;
    box-shadow:0 8px 18px rgba(146,64,14,.18);
    color:#422006;
    font-size:.92rem;
    font-weight:900;
    cursor:pointer;
    transition:
        transform .18s ease,
        box-shadow .18s ease,
        filter .18s ease;
}
.attendance-primary-button:hover{
    transform:translateY(-1px);
    box-shadow:0 10px 22px rgba(146,64,14,.22);
    filter:brightness(1.03);
}
.attendance-primary-button:active{
    transform:translateY(0);
}
.attendance-primary-button:disabled{
    cursor:not-allowed;
    opacity:.45;
    transform:none;
    box-shadow:none;
}
.attendance-secondary-button{
    width:100%;
    min-height:42px;
    padding:9px 14px;
    background:rgba(255,255,255,.27);
    backdrop-filter:blur(10px);
    -webkit-backdrop-filter:blur(10px);
    border:1px solid rgba(255,255,255,.44);
    border-radius:12px;
    color:#0f172a;
    font-size:.86rem;
    font-weight:800;
    cursor:pointer;
    transition:
        transform .18s ease,
        background .18s ease,
        box-shadow .18s ease;
}
.attendance-secondary-button:hover{
    transform:translateY(-1px);
    background:rgba(255,255,255,.38);
    box-shadow:0 7px 18px rgba(15,23,42,.09);
}
.attendance-text-button{
    padding:8px 4px;
    background:transparent;
    border:none;
    color:#334155;
    font-size:.82rem;
    font-weight:800;
    cursor:pointer;
}
.attendance-text-button:hover{
    color:#0f172a;
    text-decoration:underline;
}

/*==================================================
  Introduction
==================================================*/
.attendance-introduction{
    align-items:flex-start;
}
.attendance-introduction .attendance-primary-button{
    margin-top:3px;
}

/*==================================================
  Attendance List
==================================================*/
.attendance-review-header{
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    gap:12px;
}
.attendance-review-list{
    display:flex;
    flex-direction:column;
    gap:7px;
}
.attendance-review-row{
    display:grid;
    grid-template-columns:minmax(0,1fr) auto;
    align-items:center;
    gap:8px;
    min-height:50px;
    padding:6px 8px;
    background:rgba(255,255,255,.18);
    border:1px solid rgba(255,255,255,.34);
    border-radius:13px;
    box-shadow:0 4px 12px rgba(15,23,42,.05);
}
.attendance-review-row:has(.attendance-remove-button){
    grid-template-columns:minmax(0,1fr) auto auto;
}
.attendance-review-student{
    min-width:0;
    display:flex;
    align-items:center;
    gap:8px;
}
.attendance-review-avatar{
    flex:0 0 auto;
    width:32px;
    height:32px;
    display:flex;
    align-items:center;
    justify-content:center;
    background:rgba(255,255,255,.43);
    border:1px solid rgba(255,255,255,.54);
    border-radius:50%;
    color:#7c2d12;
    font-size:.68rem;
    font-weight:900;
}
.attendance-review-name{
    min-width:0;
    overflow:hidden;
    color:#0f172a;
    font-size:.85rem;
    font-weight:850;
    line-height:1.2;
    text-overflow:ellipsis;
    white-space:nowrap;
}
.attendance-review-choices{
    display:grid;
    grid-template-columns:56px 72px;
    gap:5px;
}
.attendance-review-choice{
    min-height:34px;
    padding:6px 7px;
    background:rgba(255,255,255,.26);
    border:1px solid rgba(255,255,255,.42);
    border-radius:9px;
    color:#475569;
    font-size:.68rem;
    font-weight:900;
    line-height:1.05;
    white-space:nowrap;
    cursor:pointer;
    transition:
        background .16s ease,
        border-color .16s ease,
        color .16s ease,
        transform .16s ease;
}
.attendance-review-choice:hover{
    transform:translateY(-1px);
    background:rgba(255,255,255,.38);
}
.attendance-review-choice[data-status="present"]{
    border-color:rgba(16,185,129,.36);
}
.attendance-review-choice[data-status="absent"]{
    border-color:rgba(245,158,11,.38);
}
.attendance-review-choice[data-status="present"].is-selected{
    background:rgba(16,185,129,.20);
    border-color:rgba(5,150,105,.68);
    color:#065f46;
}
.attendance-review-choice[data-status="absent"].is-selected{
    background:rgba(245,158,11,.21);
    border-color:rgba(217,119,6,.68);
    color:#92400e;
}
.attendance-remove-button{
    padding:5px 4px;
    background:transparent;
    border:none;
    color:#b91c1c;
    font-size:.64rem;
    font-weight:800;
    cursor:pointer;
}
.attendance-remove-button:hover{
    text-decoration:underline;
}
.attendance-review-actions{
    display:grid;
    grid-template-columns:auto minmax(170px,1fr);
    align-items:center;
    gap:12px;
}

/*==================================================
  Complete Screen
==================================================*/
.attendance-complete{
    align-items:center;
    padding:10px 0 4px;
    text-align:center;
}
.attendance-complete-mark{
    width:72px;
    height:72px;
    display:flex;
    align-items:center;
    justify-content:center;
    background:linear-gradient(
        145deg,
        rgba(16,185,129,.82),
        rgba(5,150,105,.92)
    );
    border:2px solid rgba(255,255,255,.64);
    border-radius:50%;
    box-shadow:0 12px 28px rgba(5,150,105,.24);
    color:#fff;
    font-size:1.9rem;
    font-weight:900;
}
.attendance-complete-summary{
    margin:0;
    color:#475569;
    font-size:.94rem;
    font-weight:700;
}

/*==================================================
  Mobile
==================================================*/
@media(max-width:600px){
    .attendance-experience{
        gap:12px;
    }
    .attendance-experience-title{
        font-size:1.18rem;
    }
    .attendance-experience-description{
        font-size:.82rem;
    }
    .attendance-review-list{
        gap:6px;
    }
    .attendance-review-row{
        min-height:46px;
        padding:5px 6px;
        gap:6px;
        border-radius:11px;
    }
    .attendance-review-avatar{
        width:28px;
        height:28px;
        font-size:.6rem;
    }
    .attendance-review-student{
        gap:6px;
    }
    .attendance-review-name{
        font-size:.76rem;
    }
    .attendance-review-choices{
        grid-template-columns:50px 64px;
        gap:4px;
    }
    .attendance-review-choice{
        min-height:31px;
        padding:5px 4px;
        border-radius:8px;
        font-size:.61rem;
    }
    .attendance-review-row:has(.attendance-remove-button){
        grid-template-columns:minmax(0,1fr) auto;
    }
    .attendance-remove-button{
        grid-column:1 / -1;
        justify-self:end;
        padding:2px 4px;
    }
    .attendance-review-actions{
        grid-template-columns:1fr;
        gap:7px;
    }
}
