/*==================================================
  Session Groups
==================================================*/

export function buildSessionGroups(
    sessions
){
    const groups=
        new Map();

    sessions.forEach(
        session=>{
            const sessionNum=
                Number(
                    session.session_num
                );

            if(
                !Number.isFinite(
                    sessionNum
                )||
                sessionNum<1
            ){
                return;
            }

            const groupIndex=
                Math.floor(
                    (sessionNum-1)/10
                );

            const start=
                (groupIndex*10)+1;

            const end=
                start+9;

            if(
                !groups.has(
                    groupIndex
                )
            ){
                groups.set(
                    groupIndex,
                    {
                        start,
                        end,
                        sessions:[]
                    }
                );
            }

            groups
                .get(
                    groupIndex
                )
                .sessions
                .push(
                    session
                );
        }
    );

    return Array.from(
        groups.values()
    ).sort(
        (
            a,
            b
        )=>
            a.start-b.start
    );
}
