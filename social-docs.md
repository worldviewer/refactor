# Social Share Functionality Explained

<!DOCTYPE html>
<html lang="en" itemscope itemtype="http://schema.org/Blog">
<head>
    <meta charset="UTF-8">
    <title>Is it Possible to Increase the Rate of Innovation?</title>

    <meta name="viewport" content="user-scalable=yes, maximum-scale=10, width=device-width" />
    <meta name="apple-mobile-web-app-capable" content="yes" />

    <!-- Must significantly precede body to prevent the flash of large image which occurs when image is cached, and therefore loads before document.ready fires -->

    <script>
        function bigImageLoaded(img) {
            var imgWrapper = img.parentNode;
            imgWrapper.className += imgWrapper.className ? ' loaded' : 'loaded';
        }
    </script>

    <!-- Materialize.css -->
    <link type="text/css" rel="stylesheet" href="dist/css/materialize.min.css"  media="screen,projection"/>

    <link rel="stylesheet" type="text/css" href="dist/css/main.css">

    <link rel='shortcut icon' href='get-big-things-done-favicon.png' type='image/x-icon'/ >

    <!-- For Material Icons, slightly annoying when this occasionally does not fetch -->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

    <!-- G+ sharing -->
    <script src="https://apis.google.com/js/platform.js" async defer></script>

    <!-- FACEBOOK -->

    <!-- Validator at https://developers.facebook.com/tools/debug/og/object/ -->

    <!-- Meta tags for sharing to social networks, more info here:
    https://developers.facebook.com/docs/sharing/overview#content -->
    <meta property="og:title" content="Is it Possible to Increase the Rate of Innovation?"/>
    <meta property="og:url" content="https://worldviewer.github.io/refactor/"/>

    <!-- 297 characters, and should speak to the Facebook audience -->
    <meta property="og:description" content="We have an unfortunate tradition of treating our best scientific critics as cranks or pseudoscientists. Yet there are potential answers to the biggest questions in science which are precluded by this incremental approach. Let me show you some examples of promising challenges to textbook theory."/>

    <!-- This image should be square, and it seems that the FB scraper is not able to see this image from the desktop
    version of the site (?) -->
    <meta property="og:image" content="https://worldviewer.github.io/refactor/dist/assets/img-mobile/get-big-things-done-1-facebook.jpg"/>

    <!-- This apparently necessary fix comes from ...
    http://stackoverflow.com/questions/15346444/provided-ogimage-is-not-big-enough-in-facebook-linter -->
    <link rel="image_src" type="image/jpeg" href="img_path" />

    <!-- From http://www.h3xed.com/web-and-internet/how-to-use-og-image-meta-tag-facebook-reddit
    Facebook recommends 1200 x 630 pixels for the og:image dimensions (info), which
    is an approximate aspect ratio of 1.91:1. This gives your shared post a full-size image
    above the post text. According to Facebook, you can go as low as 600 x 315 and still
    receive a full-size image, but I found that you can go as low as around 450 width. If
    you go too small (about 400 in width or less), your post will only receive a small
    square thumbnail on the left side. Also, if your image has a tall aspect ratio, Facebook
    may display a tall aspect ratio thumbnail on the left side (not square).

    A note on cropping: If you have a large image that is not in the 1.91:1 aspect ratio,
    Facebook may center and crop it to fit. If you have a small image that is not square,
    Facebook may crop it or shrink it to fit the small thumbnail size.

    Reddit uses a 70 x 70 square image for its thumbnail. Images of all sizes are resized
    down to this. Images that are wider than square will be shrunk down further to fit the
    width, while images that are taller will be cropped. Having a wide image is not good as
    it reduces the overall size of the thumbnail space that your image utilizes. Due to this,
    going with the Facebook recommendation of 1200 x 630 is bad for Reddit sharing.

    To work well on both Facebook and Reddit, be sure to make your og:image 1200 x 1200 (or
    larger) that looks good both square and cropped. Facebook will crop the top and bottom,
    while Reddit will keep it square. This gives you the largest thumbnail image on both
    sharing platforms.

    One last thing: If you do want to have the smaller square image thumbnail on Facebook, just
    make sure your og:image is smaller than 400x400 and square in aspect ratio. -->

    <meta property="og:type" content="article"/>

    <!-- This is required to access Facebook Insights -->
    <meta property="fb:admins" content="100007259376234" />
    <meta property="fb:app_id" content="414453428751445">

    <!-- TWITTER -->

    <!-- Validator at https://cards-dev.twitter.com/validator -->

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="https://worldviewer.github.io/refactor/">

    <!-- 70 character limit -->
    <meta name="twitter:title" content="Is it Possible to Increase the Rate of Innovation?">

    <!-- 200 characters before truncate, but the card validator seems to truncate earlier -->
    <meta name="twitter:description" content="There are potential answers to the biggest questions in science which are precluded by our incremental approach. Let me show you why we have a problem.">

    <!-- No smaller than 60 x 60, typical large card ratio is 280 x 150, so I'll have to create these custom -->
    <meta name="twitter:image" content="https://worldviewer.github.io/refactor/dist/assets/img-mobile/get-big-things-done-1-twitter.jpg">

    <!-- G+ -->

    <!-- Rich Snippet Generator: https://developers.google.com/+/web/snippet/?hl=en -->
    <!-- NOTE: Descriptions are no longer shown for simple shares. Only interactive posts still show descriptions. -->
    <!-- https://developers.google.com/+/web/share/interactive -->
    <meta itemprop="name" content="Is It Possible to Increase the Rate of Innovation?">
    <meta itemprop="description" content="There are potential answers to the biggest questions in science which are precluded by our incremental approach. Let me show you why we have a problem.">
    <meta itemprop="image" content="https://worldviewer.github.io/refactor/dist/assets/img-mobile/get-big-things-done-7.jpg">

    <!-- This does not seem to get picked up by the G+ crawler regardless of where I place it ...
    <meta itemprop="description" content="There are potential answers to the biggest questions in science which are precluded by our incremental approach. Let me show you why we have a problem."> -->

    <!-- GOOGLE SCHEMA -->

    <!-- For information from Google on structured data markup, see
    https://developers.google.com/structured-data/?rd=1 -->

    <!-- The beauty of it is since it’s Schema.org you can use it on nearly any HTML tag 
    on content that is already on the page.

    - Itemscope=”[pageType]” – where [pageType] is Article, Blog, Book, Event, LocalBusiness, 
      Organization, Person, Product or Review.
    - itemprop=”name” – This acts as the title attribute of the rich snippet and should be 
      limited to 140 characters.
    - itemprop=”description” – This is the description of the rich snippet and should be 
      limited to 185 characters.
    - itemprop=”image” This is the image of the rich snippet with an optimal size is 180 x 120. 
      Google+ will shrink this image, but if it is too small it will not be displayed.

    While all the other types of metadata go in the <head> section of the code, this code will 
    potentially live in various places throughout the website. -->

    <!-- Schema metadata for Google rich snippets.  I'm using it hear to show the crawler how 
    to access the individual slides.  Instructions here: 
    https://developers.google.com/structured-data/breadcrumbs?rd=1 -->
    <script type="application/ld+json" src="./google-schema-breadcrumbs.json"></script>

    <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>

    <!-- Materialize script, does not bundle due to RequireJS conflicts, must follow jQuery -->
    <script src="./dist/js/materialize.js"></script>

</head>

<body>

    <!-- The Facebook SDK for JavaScript provides a rich set of client-side functionality that:

    - Enables you to use the Like Button and other Social Plugins on your site.
    - Enables you to use Facebook Login to lower the barrier for people to sign up on your site.
    - Makes it easy to call into Facebook's Graph API.
    - Launch Dialogs that let people perform various actions like sharing stories.
    - Facilitates communication when you're building a game or an app tab on Facebook.

    The SDK, social plugins and dialogs work on both desktop and mobile web browsers.

    The Facebook SDK for JavaScript doesn't have any standalone files that need to be downloaded 
    or installed, instead you simply need to include a short piece of regular JavaScript in your 
    HTML that will asynchronously load the SDK into your pages. The async load means that it does 
    not block loading other elements of your page.

    The following snippet of code will give the basic version of the SDK where the options are 
    set to their most common defaults. You should insert it directly after the opening <body> tag 
    on each page you want to load it. 

    Like Button:
    <div class="fb-like" data-share="true" data-width="450" data-show-faces="true"></div>
    -->

    <!-- This is the first snippet they gave me ...
    <script>
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '414453428751445',
                xfbml      : true,
                version    : 'v2.5'
            });
        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src="https://connect.facebook.net/en_US/all.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    </script> -->

    <!-- This is the snippet they gave me to activate the FB share button -->
    <div id="fb-root"></div>
    <script>(function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.5&appId=414453428751445";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));</script>

    <!-- Compact Share Button:
    <div class="fb-share-button" data-href="http://worldviewer.github.io" data-layout="button"></div>

    Alternatively, trigger a Share Dialog using the FB.ui function with the share method parameter to share a link...

    FB.ui({
        method: 'share',
        href: 'https://developers.facebook.com/docs/',
    }, function(response){}); 

    More info at https://developers.facebook.com/docs/javascript/reference/FB.ui or
    https://developers.facebook.com/quickstarts/414453428751445/?platform=web -->

