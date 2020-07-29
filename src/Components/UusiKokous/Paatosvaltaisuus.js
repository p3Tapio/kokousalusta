import React from 'react'
import HelpPop from '../Shared/HelpPop'

const Paatosvaltaisuus = ({ setShowComponent, handlePaatosvaltaChange, saveKokousDraft, paatosvaltaisuus }) => {

    const helpText = "Kokouksen päätösvaltaisuuden voi määritellä täyttämällä valitsemasi kentät. Tyhjäksi jätettyä kenttää ei huomioida kokouksen päätösvaltaisuuden määrittelyssä."
    const handleClick =() => {
       setShowComponent('yhteenveto')
       saveKokousDraft() 
    }

    return (
        <div className="mt-5">
            <div className="col-md-6  m-auto">
                <div className="mb-2">
                    <h5>Kokouksen päätösvaltaisuus</h5>
                    <p style={{ marginTop: "-5px" }}>
                        <HelpPop heading="Päätösvaltaisuus" text={helpText} btnText="Selite" placement="bottom" variant="link" style={{ marginBottom: "3px", marginLeft: "-10px" }} />
                    </p>
                </div>
                <form>
                    <div className="form-group">
                        <label>Esityslista</label>
                        <input type="number" min="0" step="1" className="form-control" name="esityslista" onChange={handlePaatosvaltaChange} value={paatosvaltaisuus.esityslista} />
                        <small className="form-text text-muted">Kuinka monen kokousosallistujan on avattava esityslista kokouksen päätösvaltaisuuden täyttymiseksi?</small>
                    </div>
                    <div className="form-group">
                        <label>Aktiivisuus</label>
                        <input type="number" min="0" step="1" className="form-control" name="aktiivisuus" onChange={handlePaatosvaltaChange} value={paatosvaltaisuus.aktiivisuus} />
                        <small className="form-text text-muted">Kuinka monen käyttäjän on kommentoitava jotakin kohtaa tai kannatettava jotakin, jotta kokouksen päätösvaltaisuus täyttyy?</small>
                    </div>
                    <div className="form-group">
                        <label>Kesto</label>
                        <input type="number" min="0" step="1" className="form-control" name="kesto" onChange={handlePaatosvaltaChange} value={paatosvaltaisuus.kesto} />
                        <small className="form-text text-muted">Kuinka monta vuorokautta kokouksen on kestettävä, jotta kokous on päätösvaltainen?</small>
                    </div>
                    <div className="form-group">
                        <label>Muu kriteeri</label>
                        <textarea className="form-control" rows="3" name="muu" onChange={handlePaatosvaltaChange} value={paatosvaltaisuus.muu} />
                        <small className="form-text text-muted">Kirjoita haluamasi päätösvaltaisuuskriteeri kenttään</small>
                    </div>
                </form>
                {/* <div className="form-group text-right">
                <button onClick={() => { setShowComponent('yhteenveto'); saveKokousDraft() }} type="submit" className="btn btn-outline-primary mt-3" >Seuraava</button>
                </div> */}
            </div>
        </div>
    )
}
export default Paatosvaltaisuus