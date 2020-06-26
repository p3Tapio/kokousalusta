import React from 'react'
import {Link} from 'react-router-dom'

const AssocTable = ({yhdistykset, setShowForm}) => {
    return (
        <div>
            <button className="mb-4 btn btn-outline-primary" onClick={() => setShowForm(false)}>Liity yhdistykseen</button>
            <table className="table table-hover mt-4">
                <thead>
                    <tr className="table-primary"><th>Yhdistys</th><th></th></tr>
                </thead>
                <tbody>
                    {yhdistykset.map((item) =>
                        <tr key={item.id}>
                            <td className="mr-5">{item.name}</td><td className="text-right"><Link className="btn btn-outline-primary btn-sm" to={`/assoc/${item.name}`}>Siirry yhdistyksen sivuille</Link></td>
                        </tr>)}
                </tbody>
            </table>
        </div>
    )
}
export default AssocTable
