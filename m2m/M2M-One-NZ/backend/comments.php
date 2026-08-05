<?php
/*
  M2M One NZ — Review Packet shared-comments backend (PHP / same-origin option)
  ----------------------------------------------------------------------------
  Drop this file next to m2m-one-nz-review-packet.html on a host that runs PHP.
  Then set REVIEW_BACKEND.url = "comments.php" in the packet (see README).

  Contract the packet expects:
    GET  comments.php        -> JSON array of all comment objects
    POST comments.php  body  -> one comment object, upserted by id
  Comment object: { id, name, text, route, xPct, yPct, ts, resolved, deleted }
  Deletes are soft (the packet re-POSTs the note with deleted:true).

  Storage: a single JSON file (comments-data.json) written next to this script.
  The folder must be WRITABLE by the web server (e.g. chmod 775 the directory).
*/

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') { http_response_code(204); exit; }

$FILE = __DIR__ . '/comments-data.json';

if ($method === 'GET') {
  if (!file_exists($FILE)) { echo '[]'; exit; }
  $raw = file_get_contents($FILE);
  $data = json_decode($raw, true);
  echo json_encode(is_array($data) ? array_values($data) : []);
  exit;
}

if ($method === 'POST') {
  $body = file_get_contents('php://input');
  $n = json_decode($body, true);
  if (!$n || empty($n['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'missing id']);
    exit;
  }
  $fp = fopen($FILE, 'c+');
  if ($fp === false) {
    http_response_code(500);
    echo json_encode(['error' => 'cannot open store (check folder is writable)']);
    exit;
  }
  flock($fp, LOCK_EX);
  $raw = stream_get_contents($fp);
  $notes = json_decode($raw, true);
  if (!is_array($notes)) $notes = [];
  $found = false;
  foreach ($notes as $i => $existing) {
    if (isset($existing['id']) && $existing['id'] === $n['id']) {
      $notes[$i] = $n; $found = true; break;
    }
  }
  if (!$found) $notes[] = $n;
  ftruncate($fp, 0);
  rewind($fp);
  fwrite($fp, json_encode(array_values($notes)));
  fflush($fp);
  flock($fp, LOCK_UN);
  fclose($fp);
  echo json_encode(['ok' => true]);
  exit;
}

http_response_code(405);
echo json_encode(['error' => 'method not allowed']);
