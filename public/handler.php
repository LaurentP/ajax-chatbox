<?php

$dbh = new PDO('sqlite:../database/chatbox.db');
$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$dbh->query("CREATE TABLE IF NOT EXISTS `chatbox` (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname VARCHAR(32) NOT NULL,
    message VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))
)");

function sendMessage(PDO $dbh, string $nickname, string $message)
{
    $nickname = htmlspecialchars($nickname);
    $message = htmlspecialchars($message);
    $request = $dbh->prepare("INSERT INTO chatbox (nickname, message) VALUES(:nickname, :message)");
    $request->execute([
        'nickname' => $nickname,
        'message' => $message
    ]);
}

function showMessages(PDO $dbh)
{
    $result = $dbh->query("SELECT * FROM chatbox ORDER BY id DESC LIMIT 1000")->fetchAll(PDO::FETCH_ASSOC);
    $result = array_reverse($result);
    echo json_encode($result);
}

if (!empty($_POST['nickname']) && !empty($_POST['message'])) {
    sendMessage($dbh, $_POST['nickname'], $_POST['message']);
}

showMessages($dbh);
