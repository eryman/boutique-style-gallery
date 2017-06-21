<?php require_once __DIR__ . '/vendor/autoload.php'; ?> 

<?php

$page_id = '138723026678273';

$app_id = '189331864907753';
$app_secret = '26535f5d34a00a18958cef2a635e6bd6';
$default_graph_version = 'v2.8';
$access_token = '189331864907753|UJ0Qj5fLLBn-Ysq-whXCWkGWtW0';


$fb = new Facebook\Facebook([
  'app_id' => $app_id,
  'app_secret' => $app_secret,
  'default_graph_version' => $default_graph_version,
]);

$fb->setDefaultAccessToken($access_token);
$fields = 'name,id,about,cover,description,emails,featured_video,link,albums,events,photos,picture.width(800).height(800)';
try {
  $response = $fb->get('/' . $page_id . '?fields=' . $fields);
  $userNode = $response->getGraphUser();
} catch(Facebook\Exceptions\FacebookResponseException $e) {
  // When Graph returns an error
  echo 'Graph returned an error: ' . $e->getMessage();
  exit;
} catch(Facebook\Exceptions\FacebookSDKException $e) {
  // When validation fails or other local issues
  echo 'Facebook SDK returned an error: ' . $e->getMessage();
  exit;
}

echo $userNode;

?>
