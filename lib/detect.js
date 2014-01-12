(function(){var currentDomain = location.host,
    domainParts = currentDomain.split('.');

   // if(domainParts[0].length !== 3 && domainParts[0].toLowerCase() !== 'www'){
        /*new Element("script", {src: "jquery-2.0.3.js", type: "text/javascript"});*/

        var jq = document.createElement('script');
            jq.setAttribute('type','text/javascript');
            jq.setAttribute('src', '../xo/lib/jquery-2.0.3.js');
        var xeoOverlay = document.createElement('script');
            xeoOverlay.setAttribute('type','text/javascript');
            xeoOverlay.setAttribute('src', '../xo/lib/jquery.xeoOverlay.js');
        var nodes = document.getElementsByTagName('*'),
            node = nodes[nodes.length -1].parentNode;
        node.appendChild(jq);
        setTimeout(function(){
            node.appendChild(xeoOverlay);
        },200);


  //  }
})();