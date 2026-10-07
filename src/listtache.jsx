import React from "react";
import'./stylepagetache.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';

export default function ajouttache({task, handleEdit, handleDelete, getPriorityColor}){

    return(
    <div className='listes_taches'>
        <h4>Listes des taches({task.length})</h4>
        {task.map((t) => (
            <div className='task-card' key={t.id}> 
                <div className='task-content'>
                    <h5>{t.title}</h5>
                    <div className='div-details'>
                        <p>{t.description}</p>
                        <span>{t.category}</span>
                        <span className="div-priority">
                            <span className="div-prio-tache" style={{ backgroundColor: getPriorityColor(t.priority), }}>
                            {t.priority}
                        </span>
                        </span>
                        <span className="div-statut">{t.statut}</span>
                        <span className="div-date">📅 {t.due_date}</span>
                    </div>
                </div>

                        {/* Les boutons doivent être DANS la div de la tâche pour être sur la même ligne */}
                        <div className='task-body'>

                            <button className='button-modifier' onClick={() => handleEdit(t)}>
                              <FontAwesomeIcon icon={faPen} style={{ color: 'green', fontSize: '18px' }} />
                            </button>
                          <button  className="button-supprimer" onClick={() => handleDelete(t.id)}>
                            <FontAwesomeIcon icon={faTrash} style={{ color: 'red' }} />
                        
                            </button>
                        </div>
                    </div>
                ))}
            </div>
    )
}