import React from 'react'
import {Link} from 'react-router-dom'



const AssocTable = ({yhdistykset, setShowForm}) => {
    return (
        <div>
            <button className="mb-4 btn btn-outline-primary mx-3" onClick={() => setShowForm(false)}>Liity yhdistykseen</button>
            <table className="table table-hover mt-4">
                <thead>
                    <tr className="table-primary"><th>Yhdistys</th></tr>
                </thead>
                <tbody>
                    {yhdistykset.map((item) =>
                        <div key={item.id} >
                            {/*<td className="mr-5">{item.name}</td><td className="text-right"><Link className="btn btn-outline-primary btn-sm" to={`/assoc/${item.name}`}>Siirry yhdistyksen sivuille</Link></td>*/}
                            <Link className="mt-4 text-left text-dark" style={{textDecoration:"none"}} to={{pathname:`/assoc/${item.name}`, state:{id:item.id}}}>
                                <div className="yhdistysLink">{item.name}</div>
                            </Link>
                        </div>)}
                </tbody>
            </table>
        </div>
    )
}
export default AssocTable
