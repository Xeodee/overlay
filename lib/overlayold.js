/**
 * Created by Steve McCard on 11/13/13.
 */
//(function() {


var overlayHUD = '<div id="marcomOverlayHUD" class="right">'+
    '<div class="inner posRel">'+
    '<p>Apple Marcom Tools <span class="hideOverlay">hide</span></p>'+
    '<p>Version <span class="xeoVer"></span></p>'+
    '<hr>'+
    '<p>Browser:</p>'+
    '<p class="browVer"></p>'+
    '<hr>'+
    '<label for="boxPosition">Screen Position: </label><select name="position" id="boxPosition">'+
    '<option value="right" selected>Right</option>'+
    '<option value="left">Left</option>'+
    '<option value="bottom" disabled>Bottom</option>'+
    '</select>'+
    '<hr>'+
    '<p>Enable character addition:</p>'+
    '<button id="enableCharMode">Enable Add Mode</button>'+
    '<input type="text" value="40" id="percent" style="width:25px;"> <button id="addPercent">Add %</button>'+
    '<hr>'+
    '<p>Orphan Check <button id="orphan">Run</button></p>'+
    //'<hr>'+
    //'<p>Open Page in <input type="text" id="newPage" value="www" style="width: 75px"/><button id="openNewPage">Open</button></p>'+
    '</div>'+
    '</div>';
var lorem='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ac libero ut turpis fermentum sodales. In mi odio, malesuada id urna a, vehicula rhoncus enim. Nullam sodales quam nisi, vitae molestie nibh sodales a. Donec ac vehicula purus. Etiam sed hendrerit risus. Integer sollicitudin nulla nibh, a placerat nunc fermentum id. Nullam consectetur neque leo. Aenean tempor quam lacus, nec feugiat arcu bibendum a. Nullam nisi magna, sollicitudin vitae augue sit amet, faucibus dignissim leo. Praesent vulputate rhoncus eros, eu lacinia est tincidunt nec. Nulla malesuada iaculis urna.';
var xeoDisplayed = false;
var showedHint=false;
var xeo;
var currentPosition='right';
var slideSpeed=50;
var xeoVersion="Alpha 0.2";
var addModeEnabled=false;
var enabledNodes='p,li,h1';
var possibleOrphanNodes='p,li';
var newSubDomain,newDomain,currentDomain;



navigator.sayswho= (function(){
    var N= navigator.appName, ua= navigator.userAgent, tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
    return M;
})();

var createOverlayBox = function(pos){
    currentPosition=pos;
    xeoDisplayed=true;
    switch(pos){
        case 'right':
            xeo.slideDown(slideSpeed);
            break;
        case 'left':
            xeo.slideDown(slideSpeed);
            break;
        case 'bottom':
            break;
    }
};


var showHint=function(){
    showedHint=true;
    var position = xeo.attr('class');
    var hintHTML = '<div id="overlayHint" class="'+position+'"><p>To view the tools press:<br>Command + Shift + 8</p></div>'
    jQuery('body').append(hintHTML);
    jQuery('#overlayHint').hide();
    setTimeout(function(){
        jQuery('#overlayHint').fadeIn(function(){
            setTimeout(function(){
                jQuery('#overlayHint').fadeOut(3000,function(){
                    jQuery('#overlayHint').remove();
                });
            },4000)
        })
    },200)
};

var hideOverlayBox = function(pos,clicked){
    xeoDisplayed=false;
    if(clicked && !showedHint){
        showHint(pos);
    }

    switch(pos){
        case 'right':
            xeo.slideUp(slideSpeed);
            break;
        case 'left':
            xeo.slideUp(slideSpeed);
            break;
        case 'bottom':
            break;
    }
};
var selected,selectedAddedPercent,selectedReplacement,charsToAdd,selectedLinks,selectedHTML;

var pNodeSplitText,pNodes,nodesHTMLbefore,liNodes,orphanedNodes,thisText,newPNodeString;

/* debug Vars */

var exampleString;


$.noConflict();
jQuery(document).ready(function($){
    var clickedHide=false;
    exampleString=$('p.gf-buy');
    $('body').append(overlayHUD);
    $(enabledNodes).data('selected',false);
    // $(enabledNodes).data('hasLinks',false);
    currentDomain = location.host;
    newSubDomain = $('#newPage').val();
    newDomain = 'http://'+$('#newPage').val();
    xeo = $('#xeoOverlay');
    $('#xeoOverlay span.xeoVer').text(xeoVersion);
    $('#xeoOverlay .browVer').text(navigator.sayswho);



    $('head').append('<link rel="stylesheet" href="/internal/bin/qascripts/overlay/lib/xeoOverlay.css" type="text/css">');
    $(document).bind('keydown',function(e){
        if(e.shiftKey && e.metaKey && e.which === 56){

            xeoDisplayed ? hideOverlayBox(currentPosition,false) : createOverlayBox(currentPosition,false);

        }
    });
    $('select#boxPosition').change(function(){
        var position=$(this).val();
        xeo.removeClass().addClass(position);
        if(position === 'left'){
            var windowWidth= $(window).width(),
                overlayWidth= xeo.outerWidth(),
                leftPosition=(windowWidth-overlayWidth-5)
            xeo.animate({right: leftPosition+'px'},200);
        }
        if(position === 'right'){
            xeo.animate({right: '5px'},200);
        }
    });

    $('.hideOverlay').click(function(){
        clickedHide=true;
        hideOverlayBox(currentPosition,true);
    });

    $('a').click(function(e){
        if(addModeEnabled){
            e.preventDefault();
        }
    });
    $('.selectedForAddMode').click(function(){
        $(this).removeClass('selectedForAddMode')
    });
    var disableAddMode = function(){
        $('body').removeClass('addMode');
        $('#enableCharMode').text('Enable Add Mode');
        $('*').removeClass('selectedForAddMode');
        $(enabledNodes).unbind('click');
        addModeEnabled=false;
    };
    $('#enableCharMode').click(function(){
        console.log(addModeEnabled);

        if(!addModeEnabled){

            $('body').addClass('addMode');
            $(this).text('Disable Add Mode');

            addModeEnabled=true;
            $(enabledNodes).click(function(){
                if(addModeEnabled && !$(this).data('selected')){
                    $(this).data('selected',true);
                    console.log($(this).data('selected'));
                    $(this).addClass('selectedForAddMode');

                }
                else {
                    $(this).data('selected',false);
                    console.log($(this).data('selected'));
                    $(this).removeClass('selectedForAddMode');

                }

            });
        }
        else {
            disableAddMode();
        }


    });


    $('button#addPercent').click(function(){
        $('.selectedForAddMode').each(function(){
            selectedLinks=new Array();

            if($(this).children('a').length){
                var nodeWithLink=$(this);
                selected=$(this).text().toString();
                selectedAddedPercent = $('#percent').val()/100;

                selectedHTML=$(this).html();
                selectedLinks=$(this).children('a');
                charsToAdd= Math.round((selected.length-selectedLinks.text().length)*selectedAddedPercent);

                $(this).removeClass('selectedForAddMode');
                $.each(selectedLinks,function(i){
                    var selectedL,selectedAddedPercentL,charsToAddL;
                    selectedL=selectedLinks.eq(i).text();
                    selectedAddedPercentL = $('#percent').val()/100;
                    charsToAddL = Math.round(selectedL.length*selectedAddedPercentL);



                    selectedLinks.eq(i).text(selectedL+''+lorem.substring(0,charsToAddL));


                    if(selectedLinks.length-1===i){
                        nodeWithLink.append('<span>'+lorem.substring(0,charsToAdd)+'</span>');
                    }
                });

                disableAddMode();
            }
            else
            {
                selected=$(this).text().toString();
                selectedAddedPercent = $('#percent').val()/100;
                charsToAdd = Math.round(selected.length*selectedAddedPercent);



                $(this).text(selected+lorem.substring(0,charsToAdd));
                $(this).removeClass('selectedForAddMode');
                disableAddMode();
            }
            $(this).data('selected',false);
        });
    });
    $('button#orphan').click(function(){
        newPNodeString=[];

        $(possibleOrphanNodes).each(function(index){
            var currentNode = $(possibleOrphanNodes).eq(index);
            nodesHTMLbefore=$(possibleOrphanNodes).eq(index).html();

            // joinNewString($(currentNode));

            findOrphanOne($(currentNode),nodesHTMLbefore);

        })



    });

    setTimeout(function(){
        xeo.slideDown();
    },500)

});

var htmlToString,
    htmlStringLength,
    currentNode,
    currentNodeInnerHtml,
    lastTag,
    heightBefore,
    heightAfter,
    lastWord;

var findOrphanOne=function(node,html){
    currentNode=$(node);
    currentNodeInnerHtml=$(node).html();
    htmlToString=html.split(' ');
    htmlStringLength=htmlToString.length;
    lastWord=htmlToString[htmlStringLength-1];

    if(lastWord.charAt(lastWord.length-1)===">"){
        if(node.children().last().text().split(' ').length>1){
            // console.log(node.children().last().text().split(' ').last())

            var endTagTarget=node.children().last();

            var lastWord=endTagTarget.text().split(' ').last();

            heightBefore=node.height();

            var newHtml=endTagTarget.text(endTagTarget.replace(lastWord, ''));

            console.log('Split: '+endTagTarget.text().split(' ').last());
            console.log('End Result: '+newHtml);


            if(orphanOneHeightAfter(node,heightBefore,currentNodeInnerHtml)){

            }

        }
    }
}

var orphanOneHeightAfter=function(node,before,restoreHtml){



};


/* CODE GRAVEYARD



 var joinNewString = function(node){
 var nodeSplitText=[],
 newNodeString,
 nodeHTML;
 if(node.children().length){
 if(node.children('*').length){
 littleOrphanAnnie(node,true);
 }
 }
 if(!node.children().length){
 nodeSplitText=node.text().split(' ');
 newNodeString=nodeSplitText.join('</t> <t>');
 node.html('<t>'+newNodeString+'</t>');
 littleOrphanAnnie(node,false);
 }


 };

 var nodeCheck,
 tElements=[],
 tElementCount,
 nodeHTML,
 nodeChildren=[],
 nodeChildTag=[],
 nodeChildrenCount;

 var littleOrphanAnnie = function(nodeToScan,links){
 nodeCheck=nodeToScan;
 tElements=$(nodeToScan).children(('t'));
 tElementCount=tElements.length;

 if(links){
 nodeHTML = nodeToScan.html();
 nodeChildren = nodeToScan.contents('*');
 nodeChildrenCount = nodeChildren.length;

 console.log($(nodeChildren))
 }

 if(!links){
 var itemsToScan = nodeToScan.length,
 lastWordPosition = $(nodeToScan).children('t').last().position().top,
 secondToLastWordPosition;
 if(itemsToScan === 1){
 secondToLastWordPosition = $(nodeToScan).children('t').last().position().top;
 } else {
 secondToLastWordPosition = $(nodeToScan).children('t').last().prev().position().top;
 }
 if(lastWordPosition !== secondToLastWordPosition){
 console.log('we have a winner');
 }
 }

 $(tElements).each(function(i){

 });






 }



 $('button#addPercent').click(function(){
 var selected,selectedAddedPercent,selectedReplacement,charsToAdd;

 selected = window.getSelection().toString();

 selectedAddedPercent = $('#percent').val()/100;

 charsToAdd = Math.round(selected.length*selectedAddedPercent);



 });

 MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

 var observer = new MutationObserver(function(mutations, observer) {
 // fired when a mutation occurs
 console.log(mutations, observer);
 // ...
 });

 // define what element should be observed by the observer
 // and what types of mutations trigger the callback
 observer.observe(document, {
 subtree: true,
 attributes: true
 //...
 });

 */


//  }());