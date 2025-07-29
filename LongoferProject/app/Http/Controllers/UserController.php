<?php

namespace App\Http\Controllers;
    use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;



class UserController extends Controller
{

public function setPassword(Request $request)
{
    $request->validate([
        'password' => 'required|string|min:8|confirmed',
    ]);

    $user = $request->user();

    $user->update([
        'password' => Hash::make($request->password),
    ]);

    return response()->json(['message' => 'Password set successfully.']);
}

}
