$(document).ready(function(){
  ;
  document.addEventListener("deviceready",on_device_ready,false);
});

function on_device_ready(){

  //Check local storage for channel
  if(localStorage.channel == null || localStorage.channel == ""){
    $("#popup_dialog").popup("open");

  }
  else{
    var channel = localStorage.getItem("channel");
  }
  //***************************************************************************
  get_playlist(channel);
  $(document).on("click","#video_list li",function(){
    show_video($(this).attr("video_id"));
  });
  $("#channel_button_ok").click(function(){
    var channel = $("#channel_name").val();
    set_channel(channel);
    get_playlist(channel);

  });
//**************************

  $("#save_options").click(function(){
    save_options();
  });

  $("#clear_channel").click(function(){
    clear_channel();
  });

  $(document).on("pageinit","#options",function(e){
    var channel = localStorage.getItem("channel");
    var max_results = LocalStorage.getItem(max_results);
 

  });
}

function get_playlist(channel){
  $("#video_list").html("");

  $.get(
      "https://www.googleapis.com/youtube/v3/channels",
      {
        part: 'contentDetails',
        forUsername: channel,
        key: "AIzaSyDCAUK1O_KIvFElL8hIbhY5-iYTpsDsm7E"
      },
      function(data){
        $.each(data.items, function(i ,item){
          play_list_id = item.contentDetails.relatedPlaylists.uploads;
          get_videos(play_list_id,localStorage.getItem("max_results"));
        });
      }
  );
}

function get_videos(play_list_id,max_results){
  $.get(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        part: 'snippet',
        maxResults: max_results,
        playlistId: play_list_id,
        key: "AIzaSyDCAUK1O_KIvFElL8hIbhY5-iYTpsDsm7E"
      },
      function(data){
        var output = 0;
        $.each(data.items,function(i,item){
          output += 1;
          console.log(output);
          id = item.snippet.resourceId.videoId;
          title = item.snippet.title;
          thumbnail = item.snippet.thumbnails.default.url;
          $("#video_list").append('<li video_id="'+id+'"><img src="'+thumbnail+'"></img><h3>'+title+'<h3></li>');
          //need to refresh list view after inserting dynamically
          $("#video_list").listview().listview("refresh");
        });

      }
  );
}

function show_video(video_id){
  $("#logo").hide();
  var output = '<iframe width="100%" height="250" src="https://www.youtube.com/embed/'+video_id+'" frameborder="0" allowfullscreen></iframe>';
  $("#show_video").html(output);
}

function set_channel(channel){
  localStorage.setItem("channel",channel);
}

function save_options(){
  var channel = $("#channel_name_options").val();
  set_channel(channel);
  var max_results = $("#max_results_options").val();
  set_max_results(max_results);
  //$("body").pagecontainer("change","#main");// what the fuck is this
  $("#video_list").listview().listview("refresh");
  $.mobile.changePage("#main");
  get_playlist(channel);
}
function clear_channel(){
    localStorage.setItem("channel","");
}

function set_max_results(max_results){
  localStorage.setItem("max_results",max_results);
}
