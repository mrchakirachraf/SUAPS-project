class EvaluationController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'activite_id' => 'required|exists:activites,id',
            'etudiant_id' => 'required|exists:users,id',
            'note' => 'nullable|numeric|min:0|max:20',
        ]);

        Evaluation::updateOrCreate(
            [
                'activite_id' => $data['activite_id'],
                'etudiant_id' => $data['etudiant_id'],
            ],
            [
                'note' => $data['note'],
                'moniteur_id' => $request->user()->moniteur->id,
            ]
        );

        return response()->json(['message' => 'Note enregistrée']);
    }

    public function storeBulk(Request $request)
    {
        $data = $request->validate([
            'activite_id' => 'required|exists:activites,id',
            'notes' => 'required|array',
            'notes.*.etudiant_id' => 'required|exists:users,id',
            'notes.*.note' => 'nullable|numeric|min:0|max:20',
        ]);

        foreach ($data['notes'] as $n) {
            Evaluation::updateOrCreate(
                [
                    'activite_id' => $data['activite_id'],
                    'etudiant_id' => $n['etudiant_id'],
                ],
                [
                    'note' => $n['note'],
                    'moniteur_id' => $request->user()->moniteur->id,
                ]
            );
        }

        return response()->json(['message' => 'Toutes les notes enregistrées']);
    }
}
