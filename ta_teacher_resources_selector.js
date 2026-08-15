/*==================================================
  Teacher Resources Selection State
==================================================*/

const teacherResourceState={
    selectedRanges:
        new Set()
};

/*==================================================
  Range Helpers
==================================================*/

function getRangeKey(
    group
){
    return(
        `${group.start}-${group.end}`
    );
}

function getBlockNumber(
    group
){
    return(
        Math.floor(
            (Number(group.start)-1)/10
        )+1
    );
}

/*==================================================
  Clean Selected Ranges
==================================================*/

export function cleanSelectedRanges(
    sessionGroups
){
    const availableRanges=
        new Set(
            sessionGroups.map(
                group=>
                    getRangeKey(
                        group
                    )
            )
        );

    Array.from(
        teacherResourceState
            .selectedRanges
    ).forEach(
        key=>{
            if(
                !availableRanges.has(
                    key
                )
            ){
                teacherResourceState
                    .selectedRanges
                    .delete(
                        key
                    );
            }
        }
    );
}

/*==================================================
  Session Range Selector
==================================================*/

export function renderSessionRangeSelector(
    container,
    sessionGroups,
    onDownload
){
    const heading=
        document.createElement(
            'h3'
        );

    heading.className=
        'teacher-resource-selector-title';

    heading.textContent=
        'Select session numbers to download';

    const grid=
        document.createElement(
            'div'
        );

    grid.className=
        'teacher-resource-range-grid';

    const downloadArea=
        document.createElement(
            'div'
        );

    downloadArea.className=
        'teacher-resource-download-area';

    const downloadButton=
        document.createElement(
            'button'
        );

    downloadButton.type=
        'button';

    downloadButton.className=
        'teacher-resource-download-button';

    sessionGroups.forEach(
        group=>{
            const button=
                createRangeButton(
                    group
                );

            restoreRangeSelection(
                button,
                group
            );

            button.addEventListener(
                'click',
                ()=>{
                    toggleRangeSelection(
                        button,
                        group
                    );

                    updateDownloadButton(
                        downloadButton
                    );
                }
            );

            grid.appendChild(
                button
            );
        }
    );

    downloadButton.addEventListener(
        'click',
        async()=>{
            const blocks=
                getSelectedBlocks(
                    sessionGroups
                );

            if(
                !blocks.length||
                typeof onDownload!=='function'
            ){
                return;
            }

            await onDownload(
                blocks,
                downloadButton
            );
        }
    );

    updateDownloadButton(
        downloadButton
    );

    downloadArea.appendChild(
        downloadButton
    );

    container.appendChild(
        heading
    );

    container.appendChild(
        grid
    );

    container.appendChild(
        downloadArea
    );
}

/*==================================================
  Range Button
==================================================*/

function createRangeButton(
    group
){
    const button=
        document.createElement(
            'button'
        );

    button.type=
        'button';

    button.className=
        'teacher-resource-range-button';

    button.dataset.rangeStart=
        group.start;

    button.dataset.rangeEnd=
        group.end;

    button.setAttribute(
        'aria-pressed',
        'false'
    );

    const check=
        document.createElement(
            'span'
        );

    check.className=
        'teacher-resource-range-check';

    check.textContent=
        '✓';

    const label=
        document.createElement(
            'span'
        );

    label.className=
        'teacher-resource-range-label';

    label.textContent=
        `${group.start}–${group.end}`;

    button.appendChild(
        check
    );

    button.appendChild(
        label
    );

    return button;
}

/*==================================================
  Restore Selection
==================================================*/

function restoreRangeSelection(
    button,
    group
){
    const key=
        getRangeKey(
            group
        );

    const isSelected=
        teacherResourceState
            .selectedRanges
            .has(
                key
            );

    button.classList.toggle(
        'is-selected',
        isSelected
    );

    button.setAttribute(
        'aria-pressed',
        isSelected
            ?'true'
            :'false'
    );
}

/*==================================================
  Toggle Selection
==================================================*/

function toggleRangeSelection(
    button,
    group
){
    const key=
        getRangeKey(
            group
        );

    const isSelected=
        teacherResourceState
            .selectedRanges
            .has(
                key
            );

    if(isSelected){
        teacherResourceState
            .selectedRanges
            .delete(
                key
            );

        button.classList.remove(
            'is-selected'
        );

        button.setAttribute(
            'aria-pressed',
            'false'
        );

        return;
    }

    teacherResourceState
        .selectedRanges
        .add(
            key
        );

    button.classList.add(
        'is-selected'
    );

    button.setAttribute(
        'aria-pressed',
        'true'
    );
}

/*==================================================
  Selected Blocks
==================================================*/

function getSelectedBlocks(
    sessionGroups
){
    return sessionGroups
        .filter(
            group=>
                teacherResourceState
                    .selectedRanges
                    .has(
                        getRangeKey(
                            group
                        )
                    )
        )
        .map(
            group=>
                getBlockNumber(
                    group
                )
        )
        .sort(
            (
                a,
                b
            )=>
                a-b
        );
}

/*==================================================
  Download Button
==================================================*/

function updateDownloadButton(
    button
){
    const count=
        teacherResourceState
            .selectedRanges
            .size;

    button.disabled=
        count===0;

    button.textContent=
        count>0
            ?`Download Selected (${count})`
            :'Download Selected';
}
