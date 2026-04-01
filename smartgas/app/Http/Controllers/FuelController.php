<?php

namespace App\Http\Controllers;

use App\Models\FuelEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FuelController extends Controller
{
    public function index()
    {
        $fuelEntries = FuelEntry::where('user_id', auth()->id())->get();

        return Inertia::render('Fuel/Index', [
            'fuelEntries' => $fuelEntries,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'station_name' => ['required', 'string', 'max:255'],
            'fuel_type' => ['required', 'in:Diesel,Unleaded,Premium'],
            'price_per_liter' => ['required', 'numeric', 'gt:0'],
        ]);

        $data['user_id'] = $request->user()->id;

        FuelEntry::create($data);

        return redirect()->back();
    }
}
