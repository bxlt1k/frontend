<?php

require_once 'vendor/autoload.php';

use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\Route;
use Symfony\Component\HttpFoundation\Request;

header('Access-Control-Allow-Origin: *');

try {
    $routeIndex = new Route('/');
    $routeSignUp = new Route('/signup');
    $routeSignIn = new Route('/signin');
    $routeChat = new Route('/chat');

    $routes = new RouteCollection();
    $routes->add('index', $routeIndex);
    $routes->add('signup', $routeSignUp);
    $routes->add('signin', $routeSignIn);
    $routes->add('chat', $routeChat);

    $context = new RequestContext();
    $context->fromRequest(Request::createFromGlobals());

    $matcher = new UrlMatcher($routes, $context);
    $parameters = $matcher->match($context->getPathInfo());
} catch (Exception $e) {
    http_response_code(404);
    return;
}

if ($parameters['_route'] === 'index') {
    require_once 'templates/index-template.html';
    return;
}

if ($parameters['_route'] === 'signup') {
    require_once 'templates/signup-template.html';
    return;
}

if ($parameters['_route'] === 'signin') {
    require_once 'templates/signin-template.html';
    return;
}

if ($parameters['_route'] === 'chat') {
    require_once 'templates/chat-template.html';
    return;
}