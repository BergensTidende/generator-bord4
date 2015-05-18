<?php
require '../api/vendor/autoload.php';
require_once '../api/database.php';

// Prepare app
$app = new \Slim\Slim(array(
    'templates.path' => './api/templates',
    ));
// Prepare view
$app->view(new \Slim\Views\Twig());
$app->view->parserOptions = array(
    'charset' => 'utf-8',
    'auto_reload' => true,
    'strict_variables' => false,
    'autoescape' => true,
    'debug' => true
    );
$app->view->parserExtensions = array(new \Slim\Views\TwigExtension());
$app->contentType('text/html; charset=utf-8');


//route for FB and Google for generation of content
$app->get('/', function () use ($app){
    //$app->expires('+1 hour');
    $base_url = "<%= baseurl %>";
    $app->contentType('text/html; charset=utf-8');
    //check for fragment
    if (isset($_GET['_escaped_fragment_'])) {
        $fragment = urldecode($_GET['_escaped_fragment_']);
    }
    if (isset($fragment) && $fragment != '' && $fragment != '/') {
        $share = array();

        /*
            PROFIL
         */
        preg_match("<%= fragment %>", $fragment, $matches);
        if ($matches) {
            $something = $matches[1];
            $share["metaTitle"] = "Se jeg deles";
            $share["metaDescription"] =  "Jeg er en deletekst laget med bord4s app dele-generator"
            $share["metaImage"] = "http://scontent-a.cdninstagram.com/hphotos-xaf1/t51.2885-15/e15/10958346_931114460256093_631293980_n.jpg";
            $share["metaUrl"] = $base_url . $fragment;
            }
        }

        if (isset($share["metaTitle"])) {
            $app->render('share.html', array(
                'share' => $share
                ), 200);
        } else {
            $app->response->setStatus(404);
            $app->response->setBody("Not found 404: Nothing matching fragment");
        }
    }
});

$app->run();
?>
