<!DOCTYPE html>
<html>
<head>
    <title>Rappel de tâche</title>
</head>
<body>

    <h3>
        {{ $type === 'avant échéance'
            ? 'Rappel de tâche imminent'
            : 'Rappel : tâche après échéance'
        }}
    </h3>

    <p><strong>Titre :</strong> {{ $task->title }}</p>

    <p><strong>Description :</strong> {{ $task->description }}</p>

    <p>
        <strong>Date d'échéance :</strong>
        {{ \Illuminate\Support\Carbon::parse($task->due_date)->format('Y-m-d') }}
    </p>

    <p><strong>Priorité :</strong> {{ $task->priority ?? 'Non définie' }}</p>

    <p><strong>Statut :</strong> {{ $task->statut ?? 'En cours' }}</p>

    @if ($type === 'avant échéance')
        <p>Cette tâche arrive à échéance bientôt.</p>
    @else
        <p>Cette tâche a dépassé sa date d’échéance.</p>
    @endif

</body>
</html>
