$(document).ready(function(){

    $('.edit-book').on('click',function(){
        $('#edit-from-name').val($(this).find('name'));
        $('#edit-from-author').val($(this).find('author'));
        $('#edit-from-summary').val($(this).find('summary'));
        $('#edit-from-id').val($(this).find('id'));   
    });

    $('.delete-book').on('click',function(){
        var id = $(this).data('id');
        var url = '/delete/'+id;
        if (confirm('Delete Book?')) {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function(result){
                    console.log('deleting book...');
                    window.location.href='/';
                },
                error: function(err) {
                    console.log(err);
                } 
            });
        }   
    });

    
});
