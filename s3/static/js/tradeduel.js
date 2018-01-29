/* common js functions. */

$(document).ready(function(){

    // check mobile and add stuffs
    detectMobileSO();

    // youtube modal
    autoPlayYouTubeModal();

    //ajusta posição vertical do texto e botão no vídeo de acordo com a screen
    // if (screen.width >= 2000) {
    //     $('#header-video-texto').css('margin-top','20%');
    // }

    // // Tutorial
    // var $faqItem = $('.now-modal-faq-item');
    // $('#now-modal-faq').on('click', '.now-modal-faq-bg a', function (e) {
    //     if (!$(this).hasClass('active')) {
    //         var index = $(this).index() - 1;
    //
    //         $(this).siblings('a').removeClass('active');
    //         $(this).addClass('active');
    //
    //         $faqItem.filter('.active').removeClass('active');
    //         $faqItem.eq(index).addClass('active');
    //     }
    //
    //     e.preventDefault();
    // });
    // // /Tutorial
});

function detectMobileSO() {
    var isIphone = navigator.userAgent.indexOf("iPhone") != -1 ;
    var isIpod = navigator.userAgent.indexOf("iPod") != -1 ;
    var isIpad = navigator.userAgent.indexOf("iPad") != -1 ;
    var isAndroid = navigator.appVersion.indexOf("Android") != -1;

    if (isAndroid) {
        $('#link-download').attr("href", "https://play.google.com/store/apps/details?id=com.tradeduel.tradeduel");
        $('#btn-ios').hide();
        $('#logo').css('float','left');
    } else if(isIphone || isIpod || isIpad) {
        $("#link-download").attr("href", "https://itunes.apple.com/us/app/tradeduel/id1111685773");
        $('#btn-android').hide();
        $('#logo').css('float','left');
    } else {
        $('#link-download').hide();
        socialNewWindow();
    }
}

// add target _blank to social links
function socialNewWindow() {
    $('#copyrights a').attr("target","_blank");
}


// carrousel da seção "como funciona"
jQuery(document).ready(function($) {

    var ocFbox = $("#oc-fbox");
    ocFbox.owlCarousel({
        margin: 40,
        nav: true,
        navText: ['<i class="icon-angle-left"></i>','<i class="icon-angle-right"></i>'],
        autoplay: true,
        loop:true,
        autoplayHoverPause: true,
        dots: false,
        responsive:{
            0:{ items:1 },
            600:{ items:2 },
            1000:{ items:3 }
        }
    });
        
    var ocFbox2 = $("#oc-fbox-prints");
    ocFbox2.owlCarousel({
        margin: 40,
        nav: true,
        navText: ['<i class="icon-angle-left"></i>','<i class="icon-angle-right"></i>'],
        autoplay: true,
        loop:true,
        autoplayHoverPause: true,
        dots: false,
        responsive:{
            0:{ items:1 },
            600:{ items:2 },
            1000:{ items:3 }
        }
    });
});

// forms
$(function() {

    // contact form
    $('#btn-send-form').click(function() {
        var obs = false;
        if (($('#contactform-name').val() === '') || ($('#contactform-email').val() === '') || ($('#contactform-msg').val() === '')) {
            $('#msg-error').removeClass('hide');
            obs = true;
        }
        else {
            $('#msg-error').addClass('hide');
        }
        if(!obs) {
            $('#form-result').show();
            $.ajax({
                url: '/sendEmail',
                data: $('form').serialize(),
                type: 'POST',
                success: function(response) {
                    $('#form-result').hide();
                    $('#contactform-name').val('');
                    $('#contactform-email').val('');
                    $('#contactform-msg').val('');
                    $('#msg-success').removeClass('hide');
                    $('#msg-success').fadeOut(5000, function() {});
                },
                error: function(error) {
                    $('#form-result').hide();
                    $('#msg-error').removeClass('hide');
                    $('#email-error').html('Não foi possível enviar sua mensagem');
                }
            });
        }
    });

    // carrers form
    $("#form-vagas").validate({
        submitHandler: function(form) {
            var successResult = '<i class=icon-ok-sign></i>';
            var errorResult = '<i class=icon-remove-sign></i>';

            $('.form-process').fadeIn();

            var data = new FormData($('#form-vagas')[0]);
            /*
            var arquivoExt = ['.rtf','.txt', '.pdf', '.png','.gif','.jpg', '.jpeg', '.gif', '.pdf', 
                             '.doc','.docx','.mpeg','.mp4','.avi','.zip','.rar']

            //valida extensão do arquivo
            if (($('#arquivo').val() != '') && !$('#arquivo').hasExtension(arquivoExt)) {
                $('#form-vagas').attr("disabled", true);   
                $('.form-process').fadeOut();

                errorResult = '<i class=icon-remove-sign></i> Extensão de arquivo não permitida!'
                $('#form-vagas-result').attr("data-notify-type", "error");
                $('#form-vagas-result').attr("data-notify-msg", errorResult);
                
                return SEMICOLON.widget.notifications($('#form-vagas-result'));
            }
            */
            $.ajax({
                url: '/sendVagas',
                data: data,
                type: 'POST',
                //contentType: false,
                //processData: false,
                success: function(retorno) {

                    if (retorno === 'file-erro') {
                        successResult = '<i class=icon-remove-sign></i>Extensão de arquivo não permitida!'
                        $('#form-vagas-result').attr("data-notify-type", "error");
                    }
                    else {
                        successResult += 'Seu currículo foi enviado com sucesso!';
                        $('#form-vagas-result').attr("data-notify-type", "success");
                        $(form).find('.sm-form-control').val('');    
                    }
                    $('.form-process').fadeOut();
                    $('#form-vagas-result').attr("data-notify-msg", successResult);
                    SEMICOLON.widget.notifications($('#form-vagas-result'));
                },
                error: function(error) {
                    $('.form-process').fadeOut();
                    errorResult = 'Não foi possível enviar o formulário! \n' +
                                  'Envie email para suporte@usebenefit.com com seus ' + 
                                  'dados e no assunto coloque "vaga"';
                    
                    $('#form-vagas-result').attr("data-notify-type", "error");
                    $('#form-vagas-result').attr("data-notify-msg", errorResult);
                    return SEMICOLON.widget.notifications($('#form-vagas-result'));
                }
            });
        }
    });

    //formulário de indicação de salão
    $('#form-suggestion').on('submit', function () {
        var obs = false,
            $form = $(this),
            $inputs = $form.find('input'),
            $inputsRequired = $inputs.filter('.required');

        for (var i=0, max=$inputsRequired.length; i<max; i++) {
            if ($inputsRequired.eq(i).val() === '') {
                obs = true;
                $form.parent().find('.alertmsg').removeClass('hide');
                break;
            }
        }

        if(!obs) {
            $form.parent().find('.alertmsg').addClass('hide');
            $form.parent().find('.form-process').show();

            $.ajax({
                url: $form.attr('action'),
                data: $form.serialize(),
                type: 'POST',
                success: function(response) {
                    $inputs.val('').blur();
                    $form.parent().find('.successmsg').removeClass('hide').fadeOut(5000);
                },
                error: function(error) {
                    $form.parent().find('.alertmsg').removeClass('hide')
                        .find('.text')
                        .html('Não foi possível enviar sua mensagem');
                },
                complete: function () {
                    $form.parent().find('.form-process').hide();
                }
            });
        }

        return false;
    });

});

$.fn.hasExtension = function(exts) {
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test($(this).val());
}
    
//modal de vídeo
function autoPlayYouTubeModal() {
  var trigger = $("body").find('[data-toggle="modal"]');
  trigger.click(function () {
      var theModal = $(this).data("target");
          videoSRC = $(this).attr("data-theVideo"),
          videoSRCauto = videoSRC + "?autoplay=1";
      //$(theModal + ' iframe').attr('src', videoSRCauto);
      $(theModal + ' button.close').click(function () {
          //$(theModal + ' iframe').attr('src', videoSRC);
      });
      $('.modal').click(function () {
          //$(theModal + ' iframe').attr('src', videoSRC);
      });
  });
}

/*
* rwdImageMaps jQuery plugin v1.5
*
* Allows image maps to be used in a responsive design by recalculating the area coordinates to match the actual image size on load and window.resize
*
* Copyright (c) 2013 Matt Stow
* https://github.com/stowball/jQuery-rwdImageMaps
* http://mattstow.com
* Licensed under the MIT license
*/
;(function(a){a.fn.rwdImageMaps=function(){var c=this;var b=function(){c.each(function(){if(typeof(a(this).attr("usemap"))=="undefined"){return}var e=this,d=a(e);a("<img />").load(function(){var g="width",m="height",n=d.attr(g),j=d.attr(m);if(!n||!j){var o=new Image();o.src=d.attr("src");if(!n){n=o.width}if(!j){j=o.height}}var f=d.width()/100,k=d.height()/100,i=d.attr("usemap").replace("#",""),l="coords";a('map[name="'+i+'"]').find("area").each(function(){var r=a(this);if(!r.data(l)){r.data(l,r.attr(l))}var q=r.data(l).split(","),p=new Array(q.length);for(var h=0;h<p.length;++h){if(h%2===0){p[h]=parseInt(((q[h]/n)*100)*f)}else{p[h]=parseInt(((q[h]/j)*100)*k)}}r.attr(l,p.toString())})}).attr("src",d.attr("src"))})};a(window).resize(b).trigger("resize");return this}})(jQuery);