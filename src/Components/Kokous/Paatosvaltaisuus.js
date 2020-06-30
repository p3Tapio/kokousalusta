import React  from 'react'
import HelpPop from '../Shared/HelpPop'

const Paatosvaltaisuus = ({ setShowComponent,handlePaatosvaltaChange, paatosvaltaisuus }) => {


    const helpText = "Kokouksen päätösvaltaisuuden voi määritellä täyttämällä valitsemasi kentät. Tyhjäksi jätettyä kenttää ei huomioida kokouksen päätösvaltaisuuden määrittelyssä."

    return (
        <div className="mt-5">
            <div className="col-md-6  m-auto">
                <div className="mb-4">
                    <h5>Kokouksen päätösvaltaisuus</h5>
                    <HelpPop heading="Päätösvaltaisuus" text={helpText} btnText="Selite" placement="bottom" variant="link" style={{ marginBottom: "3px", marginLeft: "-10px" }} />
                </div>
                <form>
                    <div class="form-group">
                        <label for="eistyslista">Esityslista</label>
                        <input type="number" min="0" step="1" class="form-control" name="esityslista" onChange={handlePaatosvaltaChange} value={paatosvaltaisuus.esityslista} />
                        <small id="emailHelp" class="form-text text-muted">Kuinka monen kokousosallistujan on avattava esityslista kokouksen päätösvaltaisuuden täyttymiseksi?</small>
                    </div>
                    <div class="form-group">
                        <label for="eistyslista">Aktiivisuus</label>
                        <input type="number" min="0" step="1" class="form-control" name="aktiivisuus" onChange={handlePaatosvaltaChange}  value={paatosvaltaisuus.aktiivisuus}/>
                        <small id="emailHelp" class="form-text text-muted">Kuinka monen käyttäjän on kommentoitava jotakin kohtaa tai kannatettava jotakin, jotta kokouksen päätösvaltaisuus täyttyy?</small>
                    </div>
                    <div class="form-group">
                        <label for="eistyslista">Kesto</label>
                        <input type="number" min="0" step="1" class="form-control" name="kesto" onChange={handlePaatosvaltaChange}value={paatosvaltaisuus.kesto}/>
                        <small id="emailHelp" class="form-text text-muted">Kuinka monta vuorokautta kokouksen on kestettävä, jotta kokous on päätösvaltainen?</small>
                    </div>
                </form>
                <div className="form-group text-right">
                    <button onClick={() => setShowComponent('yhteenveto')} type="submit" className="btn btn-outline-primary mt-3">Seuraava</button>
                </div>
            </div>
        </div>

    )
}
export default Paatosvaltaisuus