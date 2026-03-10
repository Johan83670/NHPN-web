<?php
/**
 * DETAILLIUM - Script d'envoi de mail de contact
 * 
 * Ce script remplace la logique JavaScript (mailto) par un vrai envoi d'email côté serveur.
 * Il gère les demandes de devis pour particuliers et professionnels.
 */

// Configuration
$destinataire = 'contact@detaillium.fr';
$sujet_prefix = '[DETAILLIUM]';

// Prestations disponibles (mêmes que dans scriptcontact.js)
$prestations = [
    'particulier' => [
        'Formule Premium',
        'Formule Médium',
        'Formule Low-Cost',
        'Nettoyage de mobilier & extérieur'
    ],
    'professionnel' => [
        'Formule Premium Pro',
        'Formule Médium Pro',
        'Formule Low-Cost Pro',
        'Nettoyage de locaux & extérieurs professionnels'
    ]
];

// Fonction pour nettoyer les entrées
function sanitize($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Fonction pour valider l'email
function valider_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Vérifier si la requête est POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Récupérer et valider les données
$type = isset($_POST['type']) ? sanitize($_POST['type']) : '';
$prestation = isset($_POST['prestation']) ? sanitize($_POST['prestation']) : '';
$nom = isset($_POST['nom']) ? sanitize($_POST['nom']) : '';
$email = isset($_POST['email']) ? sanitize($_POST['email']) : '';
$telephone = isset($_POST['telephone']) ? sanitize($_POST['telephone']) : '';
$message = isset($_POST['message']) ? sanitize($_POST['message']) : '';

// Validation des champs obligatoires
$erreurs = [];

if (empty($type) || !in_array($type, ['particulier', 'professionnel'])) {
    $erreurs[] = 'Type de client invalide';
}

if (empty($prestation)) {
    $erreurs[] = 'Veuillez sélectionner une prestation';
} elseif (!in_array($prestation, $prestations[$type] ?? [])) {
    $erreurs[] = 'Prestation invalide';
}

if (empty($nom)) {
    $erreurs[] = 'Veuillez indiquer votre nom';
}

if (empty($email)) {
    $erreurs[] = 'Veuillez indiquer votre adresse email';
} elseif (!valider_email($email)) {
    $erreurs[] = 'Adresse email invalide';
}

if (empty($telephone)) {
    $erreurs[] = 'Veuillez indiquer votre numéro de téléphone';
}

// Si erreurs, retourner
if (!empty($erreurs)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $erreurs]);
    exit;
}

// Construire le sujet et le corps du mail
$type_label = $type === 'professionnel' ? 'Pro' : 'Particulier';
$sujet = "$sujet_prefix [$type_label] Demande de devis - $prestation";

$corps = "Nouvelle demande de devis reçue via le site DETAILLIUM\n";
$corps .= "=".str_repeat("=", 50)."\n\n";
$corps .= "TYPE DE CLIENT : " . ucfirst($type) . "\n";
$corps .= "PRESTATION DEMANDÉE : $prestation\n\n";
$corps .= str_repeat("-", 50)."\n";
$corps .= "COORDONNÉES DU CLIENT\n";
$corps .= str_repeat("-", 50)."\n\n";
$corps .= "Nom : $nom\n";
$corps .= "Email : $email\n";
$corps .= "Téléphone : $telephone\n\n";

if (!empty($message)) {
    $corps .= str_repeat("-", 50)."\n";
    $corps .= "MESSAGE\n";
    $corps .= str_repeat("-", 50)."\n\n";
    $corps .= $message . "\n";
}

$corps .= "\n" . str_repeat("=", 50) . "\n";
$corps .= "Message envoyé automatiquement depuis detaillium.fr\n";

// Headers pour l'email
$headers = [
    'From' => "$nom <$email>",
    'Reply-To' => $email,
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=UTF-8'
];

$headers_string = '';
foreach ($headers as $key => $value) {
    $headers_string .= "$key: $value\r\n";
}

// Envoyer l'email
$envoye = mail($destinataire, $sujet, $corps, $headers_string);

if ($envoye) {
    // Email de confirmation au client
    $sujet_confirmation = "$sujet_prefix Confirmation de votre demande";
    $corps_confirmation = "Bonjour $nom,\n\n";
    $corps_confirmation .= "Nous avons bien reçu votre demande de devis pour la prestation suivante :\n";
    $corps_confirmation .= "- Type : " . ucfirst($type) . "\n";
    $corps_confirmation .= "- Prestation : $prestation\n\n";
    $corps_confirmation .= "Nous vous recontacterons dans les plus brefs délais.\n\n";
    $corps_confirmation .= "Cordialement,\n";
    $corps_confirmation .= "L'équipe DETAILLIUM\n\n";
    $corps_confirmation .= "---\n";
    $corps_confirmation .= "DETAILLIUM - Nettoyage automobile haut de gamme\n";
    $corps_confirmation .= "Tel: 07 85 47 95 58\n";
    $corps_confirmation .= "Email: contact@detaillium.fr\n";
    
    $headers_confirmation = "From: DETAILLIUM <contact@detaillium.fr>\r\n";
    $headers_confirmation .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    mail($email, $sujet_confirmation, $corps_confirmation, $headers_confirmation);
    
    echo json_encode(['success' => true, 'message' => 'Votre demande a été envoyée avec succès !']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi du message. Veuillez réessayer.']);
}
?>
