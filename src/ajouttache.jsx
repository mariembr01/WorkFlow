import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './styleajouttache.css';

export default function AjoutTache({ open, onclose, refrech, taskToEdit, darkMode }) {
  // Initialisation dynamique du formulaire
  const initialFormData = () => ({
    title: taskToEdit?.title || '',
    description: taskToEdit?.description || '',
    due_date: taskToEdit?.due_date || '',
    category: taskToEdit?.category || 'Personnel',
    priority: taskToEdit?.priority || 'Moyenne',
    statut: taskToEdit?.statut || 'A faire'
  });

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);


  // Quand on ouvre le modal, on met à jour formData uniquement si taskToEdit change
  useEffect(() => {
    if (open) {
      setFormData(initialFormData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskToEdit, open]);

  if (!open) return null;

  const token = localStorage.getItem('token');

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // bouton désactivé

    try {
      if (taskToEdit) {

  const noChanges =
    taskToEdit.title === formData.title &&
    taskToEdit.description === formData.description &&
    taskToEdit.due_date === formData.due_date &&
    taskToEdit.category === formData.category &&
    taskToEdit.priority === formData.priority &&
    taskToEdit.statut === formData.statut;

  if (noChanges) {
    Swal.fire({
      icon: 'info',
      title: 'Aucune modification',
      text: 'Vous n’avez modifié aucun champ.',
      confirmButtonText: 'OK'
    });
    setLoading(false);
    return;
  }

  if (taskToEdit.due_date !== formData.due_date) {
    formData.reminder_before_sent = 0;
    formData.reminder_after_sent = 0;
  }

  await axios.put(
    `http://localhost:8000/api/tasks/${taskToEdit.id}`,
    formData,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
} else {

        await axios.post(`http://localhost:8000/api/tasks`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      
    const result = await Swal.fire({
      icon: 'success',
      title: 'Succès!',
      text: taskToEdit ? 'La tâche a été modifiée avec succès.' : 'La tâche a été créée avec succès.',
      confirmButtonText: 'OK'
    });

    if (result.isConfirmed) {
      refrech();  
      onclose();  
    }
    } catch (error) {
      console.error("Erreur :", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur!',
        text: 'Une erreur est survenue, réessayez.',
      });
    } finally {
      setLoading(false); // réactiver le bouton
    }
  };


  return (
    <div className={`div-ajouttache ${darkMode ? 'dark-mode' : ''}`}>
      <div className="div-contenu">
        <h4>{taskToEdit ? 'Modifier la tâche' : 'Ajouter une tâche'}</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Titre"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="Personnel">Personnel</option>
            <option value="Travail">Travail</option>
            <option value="Autre">Autre</option>
          </select>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="Moyenne">Moyenne</option>
            <option value="Haute">Haute</option>
            <option value="Basse">Basse</option>
          </select>
          <select
            value={formData.statut}
            onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
          >
            <option value="A faire">A faire</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
          <button type="submit" className="button-ajout" disabled={loading}>
            {loading 
              ? taskToEdit 
                ? "Modification..." 
                : "Création..." 
              : taskToEdit 
                ? "Enregistrer les modifications" 
                : "Créer"}
          </button>
          <button type="button" onClick={onclose}>
            Annuler
          </button>
        </form>
      </div>
    </div>
  );
}
