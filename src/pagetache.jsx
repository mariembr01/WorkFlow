import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Ajouttache from './ajouttache';
import './stylepagetache.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Listtache from './listtache.jsx';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'; 
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';


export default function Pagetache() {
    const [task, setTasks] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState("Tous");
    const [priority, setPriority] = useState("Tous");
    const [statut, setStatut] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [activeView, setActiveView] = useState('null');
    const [showModal, setShowModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    const navigate = useNavigate();

    const getToken = () => localStorage.getItem('token'); // Récupère le token

    const fetchTasks = useCallback(async () => {
        const token = getToken();
        try {
            const response = await axios.post(
                "http://localhost:8000/api/tasks/filter",
                { search, category, priority, statut },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des taches:", error);
        }
    }, [search, category, priority, statut]);

    useEffect(() => { fetchTasks(); }, [fetchTasks]);

   



const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Cette tâche sera supprimée définitivement !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    customClass: {
      confirmButton: 'swal-confirm-btn', // bouton confirmer
      cancelButton: 'swal-cancel-btn',   // bouton annuler
    },
    buttonsStyling: false // désactive le style par défaut de SweetAlert2
  });

  if (result.isConfirmed) {
    const token = getToken();
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await Swal.fire({
        icon: 'success',
        title: 'Supprimé !',
        text: 'La tâche a été supprimée avec succès.',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'swal-confirm-btn',
        },
        buttonsStyling: false
      });

      await fetchTasks(); // rafraîchir la liste
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Impossible de supprimer la tâche.",
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'swal-confirm-btn',
        },
        buttonsStyling: false
      });
    }
  }
};



    const handleEdit = (task) => {
        setTaskToEdit(task);
        setShowModal(true);
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

        const draggedTask = task.find(t => t.id.toString() === draggableId);
        const newStatut = destination.droppableId;
        setTasks(task.map(t => t.id.toString() === draggableId ? { ...t, statut: newStatut } : t));

        const token = getToken();
        try {
            await axios.put(`http://localhost:8000/api/tasks/${draggableId}`, 
                { draggedTask, statut: newStatut },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error("Erreur mise à jour statut:", error);
            fetchTasks();
        }
    };

    const handleLogout = async () => {
        const token = getToken();
        try {
            await axios.post(`http://localhost:8000/api/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Erreur déconnexion serveur:", error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        }
    };

    const getPriorityColor = (priority) => {
        if (priority === "Haute") return "red";
        if (priority === "Moyenne") return "orange";
        if (priority === "Basse") return "green";
    };

    const getTaskStatusInfo = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const overdueCount = task.filter(t => t.statut !== 'Terminé' && t.due_date && new Date(t.due_date) < today).length;
        const nearCount = task.filter(t => {
            if (t.statut === 'Terminé' || !t.due_date) return false;
            const d = new Date(t.due_date);
            const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
            return diff >= 0 && diff <= 2;
        }).length;
        return { overdueCount, nearCount };
    };

    const { overdueCount, nearCount } = getTaskStatusInfo();
    const columns = ["A faire", "En cours", "Terminé", "Annulé"];

    return (
        <div className={`div-pagetache ${darkMode ? 'dark-mode' : ''}`}>
            <header className='header-tache'>
                <div className='div-logo'>
                    <img src="public/logo.png" alt="" className='img-logo' />
                    <h1>WorkFlow</h1>
                </div>
                {(overdueCount > 0 || nearCount > 0) && (
                    <div className='alerts-container'>
                        {overdueCount > 0 && <div className='alert-box' style={{ color: 'red' }}>Attention : vous avez {overdueCount} tâches en retard!</div>}
                        {nearCount > 0 && <div style={{ color: 'green' }}>Rappel: {nearCount} tâche(s) arrivent à échéance bientôt.</div>}
                    </div>
                )}
                <div className='nav-mode'>
                    <button onClick={() => setDarkMode(!darkMode)} className='button-dark'>
                        {darkMode ? '🌙' : '☀️'}
                    </button>
                </div>
                <div>
                    <button className="logout-button"  onClick={handleLogout}>
                    <FontAwesomeIcon icon={faRightFromBracket} style={{ color: 'red', fontSize: '18px' }} />
                    Logout
                    </button>
                </div>
            </header>

            <div className='main-div'>
                <nav className='nav-tache'>
                    <p className='nav-title'>VIEWS</p>
                    <button className={`nav-item ${activeView === 'list' ? 'active' : ''}`} onClick={() => setActiveView('list')}>Listes des tâches</button>
                    <button className={`nav-item ${activeView === 'kanban' ? 'active' : ''}`} onClick={() => setActiveView('kanban')}>Kanban view</button>
                </nav>

                <article className='contenu-tache'>
                    {activeView !== null && (
                        <div>
                            <h4>Recherche & Filtres</h4>
                            <input type="text" placeholder="Chercher par titre ou description" value={search} onChange={(e) => setSearch(e.target.value)} className='input-search' />
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Toutes les catégories</option>
                                <option value="Personnel">Personnel</option>
                                <option value="Travail">Travail</option>
                                <option value="Autre">Autre</option>
                            </select>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="">Toutes les priorités</option>
                                <option value="Haute">Haute</option>
                                <option value="Moyenne">Moyenne</option>
                                <option value="Basse">Basse</option>
                            </select>
                            <select value={statut} onChange={(e) => setStatut(e.target.value)}>
                                <option value="">Tous les statuts</option>
                                <option value="A faire">A faire</option>
                                <option value="En cours">En cours</option>
                                <option value="Terminé">Terminé</option>
                                <option value="Annulé">Annulé</option>
                            </select>
                            <button onClick={() => setShowModal(true)} className='button-tache'>+ Nouvelle Tâches</button>
                        </div>
                    )}

                    <div className='view-container'>
                        {activeView === 'list' &&
                            <Listtache task={task} handleEdit={handleEdit} handleDelete={handleDelete} getPriorityColor={getPriorityColor} />
                        }

                        {activeView === 'kanban' &&
                            <div className='div-kanban'>
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <div className="div-drag-drop">
                                        {columns.map((colId) => (
                                            <div key={colId} className="div-drag-drop-column">
                                                <h3>{colId}</h3>
                                                <Droppable droppableId={colId}>
                                                    {(provided) => (
                                                        <div {...provided.droppableProps} ref={provided.innerRef} className="div-provided">
                                                            {task.filter(t => t.statut === colId).map((t, index) => (
                                                                <Draggable key={t.id.toString()} draggableId={t.id.toString()} index={index}>
                                                                    {(provided) => (
                                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="div-provided">
                                                                            <h5>{t.title}</h5>
                                                                            <p>{t.description}</p>
                                                                            <p>{t.category}</p>
                                                                            <p className='p-priority' style={{ backgroundColor: getPriorityColor(t.priority) }}>{t.priority}</p>
                                                                             <button className='button-modifier' onClick={() => handleEdit(t)}>
                                                                                <FontAwesomeIcon icon={faPen} style={{ color: 'green', fontSize: '18px' }} />
                                                                            </button>
                                                                            <button  className="button-supprimer" onClick={() => handleDelete(t.id)}>
                                                                                <FontAwesomeIcon icon={faTrash} style={{ color: 'red' }} />
                                                                                                    
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {provided.placeholder}
                                                        </div>
                                                    )}
                                                </Droppable>
                                            </div>
                                        ))}
                                    </div>
                                </DragDropContext>
                            </div>
                        }
                    </div>

                    <Ajouttache
                        open={showModal}
                        onclose={() => { setShowModal(false); setTaskToEdit(null); }}
                        refrech={fetchTasks}
                        taskToEdit={taskToEdit}
                        darkMode={darkMode}
                    />
                </article>
            </div>
        </div>
    );
}
