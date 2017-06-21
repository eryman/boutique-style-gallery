var module = angular.module("myApp", []);


module.factory('myService', function($http) {
    return {
        getData: function() {
            //return the promise directly.
            return $http.get('getdata.php')
                .then(function(result) {
                //resolve the promise as the data
                return result.data;
            });
        }
    }
});

var ajaxRequest = function(resource, callback){
    $.ajax({
        type: 'POST',
        headers: {
            "cache-control": "no-cache"
        },
        url: resource,
        async: false,
        cache: false,
        success: function(jsonString){
          callback(jsonString);
        }
    });
  }

var populatePhotosCallback = function(jsonString){
    if (jsonString){        
        var photoData = JSON.parse(jsonString);
        populatePhotosHelper(photoData);
    } else {
        window.alert("error!");
    }
    $(window).resize(function(){
        $photo.css('height', $photo.width());
    })
}

var populatePhotosHelper = function(data){
    console.log(data);
    console.log(data.photos[0].source)
    $photo_container = $('.photos');
    console.log($('#photos'));
    $('#photos').css('background-image', 'url(' + data.photos[0].source + ')')
    data.photos.forEach(function(photo){
      $photo_container.append('<div class="col-lg-2 photo"></div>')
      $photo = $('.photo');
      $photo_last = $('.photo:last');
      $photo_last.css('background-image', 'url(' + photo.source +')')
      $photo_last.css('background-size', 'cover')
      $photo_last.css('height', $photo_last.width());
      $photo_last.attr('name', photo.source)
      $photo_last.attr('data-toggle', 'modal');
      $photo_last.attr('data-target', '#exampleModalLong');
      $photo_last.attr('ng-click', 'initPhotoModal()')
    })                
}

ajaxRequest('getphotodata.php', populatePhotosCallback)

var populateEventModal = function(eventId){
    $('.modal-body-text').empty();
    var eventData = "name=" + eventId;
    console.log(eventData);
    $.ajax({
        type: "POST", 
        url: "geteventdata.php",
        dataType: "json", // Add datatype
        data: eventData
      }).done(function (data) {
          eventObject = data;
          $('.modal-link').show();
          $('.modal-title').text(data.name);
          $('.modal-image').attr('src', data.cover.source)
          data.description = data.description.split('\n');
          data.description.forEach(function(line){
              $('.modal-body-text').append('<p>' + line + '</p>');
          })
          $('.modal-link').attr('href', 'https://www.facebook.com/events/' + data.id)
          console.log(eventObject);
      }).fail(function (data) {
          console.log(data);
      });
}

var populatePhotoModal = function(photoSrc){
    $('.modal-body-text').empty();
    $('.modal-title').empty();
    $('.modal-link').hide();
    $('.modal-image').attr('src', photoSrc);
}

$('.photo').click(function(){
    console.log($(this).attr('name'));
    populatePhotoModal($(this).attr('name'));
})

$('.submit').click(function(){
    console.log('email working');
    var form_data = $('#contactForm').serialize() + '&destination=' + $('#contactForm').attr('name');
    console.log(form_data);
    //if ($('#name').val() === '' | $('#email').val() === '' | $('#subject').val() === '' | $('#message').val() === '' | $('#category').val() === ''){
      //window.alert('Must complete all required fields!');
    //} else {
      $.ajax({
          type: "POST", 
          url: "emailform.php",
          dataType: "json", // Add datatype
          data: form_data
        }).done(function (data) {
            console.log(data);
            alert("Message sent!");
        }).fail(function (data) {
            alert("Message failed to send");
            console.log(data);
        });
      //}
    }); 



var hasContent = function(data){
  return data.length > 0;
}

var splitTextBlock = function(text){
  if (text && text.indexOf('\n') > -1) {
    return text.split('\n').filter(hasContent)
  } else {
    return text;
  }
}

var months = [' ','January','February','March','April','May','June','July','August','September','October','November','December'];
var refineDate = function(eventDate){
    var date = months[parseInt(eventDate.substring(5, 7))] + ' ' + eventDate.substring(8, 10) + ', ' + eventDate.substring(0,4);
    return date;
  }

module.controller('MainController', function($scope, myService) {
    myService.getData().then(function(data) {
      console.log(data)
      // HEADER
        $scope.name = data.name;//
        $scope.about = splitTextBlock(data.about);//
        $scope.picture = data.picture;//
        $scope.cover = data.cover;//
      // ABOUT
        $scope.description = splitTextBlock(data.description);//
        $scope.bio = splitTextBlock(data.bio);//
        $scope.affiliation = splitTextBlock(data.affiliation);
        $scope.personal_info = splitTextBlock(data.personal_info);//
        $scope.personal_interests = splitTextBlock(data.personal_interests);
        $scope.general_info = splitTextBlock(data.general_info);//
        $scope.hometown = data.hometown;
      // CONTACT
        $scope.contact_address = data.contact_address;
        $scope.current_location = data.current_location;
        $scope.phone = data.phone;
        $scope.press_contact = data.press_contact;
        $scope.email = data.emails[0];
      // EVENTS
        $scope.events = [];
        $scope.initEventModal = function(){
            populateEventModal(this.event.id);
        }
        //$scope.events.date = refineDate(data.events.start_time.date);
      // PHOTOS

        $scope.photos = data.photos;
        $scope.albums = data.albums;
        $scope.feed = data.feed;

        data.events.forEach(function(event){
              console.log(event);
          event.start_time.date = refineDate(event.start_time.date);
          $scope.events.push(event);

        })
    });
});


        
