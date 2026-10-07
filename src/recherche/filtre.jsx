import {useState} from 'React';

export default function Filtre(){
    return(
        <div className="div_filtre">
            <h4>Recheche&Filtres</h4>
            <div className="select_filtre">
                <input type="text" placeholder="Chercher par titre ou description"/>
                <select>
                    <option value="" disabled>Toutes catégories</option>
                    <option>Autre</option>
                    <option>Travail</option>
                    <option>Personnel</option>
                </select>

                <select>
                    <option value="" disabled>Toutes priorités</option>
                    <option>Moyenne</option>
                    <option>Haute</option>
                    <option>Basse</option>
                </select>

                <select>
                    <option value="" disabled>Toute statuts</option>
                    <option>A faire</option>
                    <option>En cours</option>
                    <option>Terminé</option>
                </select>
            </div>
        </div>
    )
}