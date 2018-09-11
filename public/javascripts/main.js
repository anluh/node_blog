$(document).ready(function(){
  $('.delete-article').on('click', function(e){
    let $target = $(this);
    const id = $target.attr('data-id');

    $.ajax({
      type: 'DELETE',
      url: '/articles/'+id,
      success: function(responce){
        // alert('Deleting Article');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    })
  })
});