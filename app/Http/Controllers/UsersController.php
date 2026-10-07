<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth as FacadesJWTAuth;

class UsersController extends Controller
{
    // Inscription
    public function registre(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|max:12|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->email_verified_at = now();
        $user->save();
        // ✅ Envoi de l'email de vérification
        //$user->sendEmailVerificationNotification();

        $token = FacadesJWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Utilisateur enregistré. Veuillez vérifier votre email.',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    // Connexion
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|max:12|min:8',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'Cet email n’existe pas. Veuillez vous inscrire.'], 401);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Mot de passe incorrect'], 401);
        }

        // ✅ Vérification que l'email est confirmé
       /* if (!$user->hasVerifiedEmail()) {
            return response()->json(['error' => 'Email non vérifié. Veuillez vérifier votre boîte mail.'], 403);
        }*/

        $token = FacadesJWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user->makeHidden(['password']),
            'token' => $token
        ], 201);
    }

    // Déconnexion
    public function logout(Request $request)
    {
        try {
            $token = FacadesJWTAuth::getToken();
            if (!$token) {
                return response()->json(['error' => 'Token non fourni'], 401);
            }

            FacadesJWTAuth::invalidate($token);

            return response()->json(['message' => 'Déconnexion réussie'], 201);

        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['error' => 'Échec de la déconnexion'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token expiré'], 401);
        }
    }
}
