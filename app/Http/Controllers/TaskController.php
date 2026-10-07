<?php
namespace App\Http\Controllers;
use App\Models\Task;
use Illuminate\Http\Request;
use League\CommonMark\Extension\DescriptionList\Node\Description;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    //sert a afficher toute les taches ok maryouma
    public function index(Request $request){
        $query = Task::query();
        
        //taamel research by title or description
        if($request ->filled('search')){
            $query -> where(function($q) use ($request) {
            $q->where('title','like','%'.$request->search.'%')
            ->orWhere('description','like','%'.$request->search.'%');
        });
        }
        //filtrer par category
        if ($request ->filled('category') && strtolower( $request -> category) !== 'tous'){
            $query ->where('category',$request->category);
        }
        
        if ($request ->filled('priority') && strtolower($request -> priority) !== 'tous'){
            $query ->where('priority',$request->priority);
        }
        
        if ($request ->filled('statut') && strtolower($request -> statut) !== 'tous'){
            $query ->where('statut',$request->statut);
        }
        //mtaa trie
        if($request ->sort_by == 'priority'){
            $query->orderByRaw("FIELD(priority,'haute','moyenne','basse')");
        }
        elseif($request->sort_by=='status'){
            $query->orderByRaw("FIELD(status,'A faire','en cours','Terminé','annulé')");
        }
        elseif($request->sort_by=='category'){
            $query->orderByRaw("FIELD(category,'Personnel','Travail','Autre')");

        }
        else{
            $query->orderBy('due_date','asc');
        }
        return response() ->json($query-> get());
    }

    //elle ajoute une nouvelle tache bel Task::create
    public function store(request $request){
        $task = task::create([
            'title' => $request -> title,
            'description' => $request -> description,
            'category' => $request -> category,
            'priority' => $request -> priority,
            'statut' => $request -> statut,
            'due_date' => $request -> due_date,
            'user_id' => Auth::id(),
        ]);
        return response() ->json($task , 201);
    }

    //modification sur une tache existante
    public function update(Request $request, $id){
        //findorFail:erreur c'est la tache n'existe pas
        $task = Task::findOrFail($id);
        $task -> update($request->all());
        return $task;
    }
    //tfasekh une tache
    public function destroy($id){
        $task = Task::find($id);

        if(!$task){
            return response() ->json(['message' => 'tache non trouvée'],404);
        }
        $task -> delete();
        return response() -> json(['message' =>'tache supprimée avec succée'],200);
    }
}
