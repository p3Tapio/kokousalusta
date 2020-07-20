import React from 'react'

const Jasenlista = ({members}) => {
    return (   
        <div style={{marginTop:"4px"}} >
            <table className="table table-hover">
                <thead>
                    <tr className="table-primary"><td>Etunimi</td><td>Sukunimi</td><td>Sähköpostiosoite</td></tr>
                </thead>
                <tbody>
                    {members.map((item, key) =>
                        <tr key={key + item.firstname}>
                            <td>{item.firstname}</td>
                            <td>{item.lastname}</td>
                            <td>{item.email}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
export default Jasenlista
