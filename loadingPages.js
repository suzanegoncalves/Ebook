/**
*
*  Ebook Module: loading.js
*
*  Module developed for integration of diferent ebook vendors for the libraries.
*
* @author Suzane Goncalves <suzanehgoncalves@gmail.com>
* @copyright GPL2 2012, Suzane Goncalves
*
*/


$(function(){
	//find if drupal is using url by rewrite module or not
	var ajaxUrlModel;

	if(location.href.indexOf("?q=") == -1){
		ajaxUrlModel = "%s/search";
	}
	else{
		ajaxUrlModel = "?q=ebooks/%s/search";
	}

	function displayAudioBook(){
		var source = $(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
		var emptyTr = source.prev().prev();

		var descriptionTr = emptyTr.prev();
		var emptyTr2 = descriptionTr.prev();
		var titleTr = emptyTr2.prev();
		var endTr = source.next();


		titleTr.css('display','table-row');
		emptyTr.css('display','table-row');
		descriptionTr.css('display','table-row');
		endTr.css('display','table-row');
		emptyTr2.css('display','table-row');
	}


	function hideBooksOverdrive(t){

      //function to remove one book from overdrive starting from an source image (audio, wmv )
      var avoidDuplicate = function(){
         //this is the variable who contains the image element
         var t = $(this);

         //getting the tr parent
         var tr = (t.parent().parent().parent().parent().parent().parent());

         //remove previous tr and next tr corresponding to one book item
         tr.prev().prev().prev().prev().remove();
         tr.prev().prev().prev().remove();
         tr.prev().prev().remove();
         tr.prev().remove();
         tr.next().remove();
         tr.remove();
      }

      //execute function avoidDuplicate for those images below:
      $('img[src*="Format35Thumb.gif"]', t).each(avoidDuplicate);
      $('img[src*="Format30Thumb.gif"]', t).each(avoidDuplicate);
      $('img[src*="Format25Thumb.gif"]', t).each(avoidDuplicate);
      $('img[src*="Format425Thumb.gif"]', t).each(avoidDuplicate);

	}

   function hideAudioBooks(){
		var el = $('#ebooks-overdrive');

		$('table tr', el).each( function(){
			$(this).css('display', 'none');
		});

      $('img[src*="Format410Thumb.gif"]', el).each(displayAudioBook);
      $('img[src*="Format420Thumb.gif"]', el).each(displayAudioBook);
      $('img[src*="Format50Thumb.gif"]', el).each(displayAudioBook);

      $('table tr table tr', el).each(function() {
         $(this).css('display', 'table-row');
      });
   }

   function overdriveLoading (content) {

        $('.loading-overdrive').css('display', 'none');

        if (content!= '')
        {

			//creating a span to manipulate the content
			var span = $('<span>');
			//insert the content into span
			span.html(content);

         //getting the table whose store books from next page
         var table =  $("table", span)[0];

         //hide audiobooks from overdrive
			hideBooksOverdrive($(table));

			//insert content into overdrive fieldset
         overdrive.append(span.html());
         page++;
         url = 'http://myrcpl.lib.overdrive.com/'+session+'/SearchResults.htm?SearchID='+id+'&Page='+page;
         AjaxOverdrive();
        }
    }

    function AjaxOverdrive ()
    {
        $('.loading-overdrive').appendTo(overdrive);
        $('.loading-overdrive').css('display', 'block');
        var searchs = {
            url:    url,
            cookie: cookie,
            cookie_url: session
        };
		  $.ajax({
            url:     ajaxUrlModel.replace("%s", "overdrive"),
            type:    'POST',
            success: overdriveLoading,
            data:    searchs
        });
    }

    function threeMLoading(content)
    {

        $('.loading-3m').css('display', 'none');

        if (content!= '')
        {

            //create a span to manipulate the content
            var span = $('<span>');
            //add the content inside the span

			   span.html(content);

			   //find for each book inside the span and get the first one
			   var firstNew = $('.doc-link', span)[0];

			   //find the link of the title inside the first item and get his text removing all spaces before and after
			   var firstNewTitle = $('a[id*="title"]', firstNew).text().trim();

			   //Getting all books previously searched
			   var lastOlds = $('.doc-link', threeM);

			   //Getting only the last book
			   var lastOld = lastOlds[lastOlds.length-1];

			   //Getting his title
			   var lastOldTitle = $('a[id*="title"]', lastOld).text().trim();

            //Comparing if the last one and the new one has the same title
			   if(firstNewTitle == lastOldTitle){
               //hide one of them
               lastOld.style.display = "none";
            }

            //Add the span with the modified content to the 3m panel
            threeM.append(span.html());

            page_3m++;
            if($('.edit-ebooks-available').checked()){
               url_3m = "http://ebook.3m.com/library/en/RCPL-query-"+keyword_3m+"-not_in_stock_items-exclude-physical_items-exclude-not_loanable_items-include-search-page-"+page_3m+"/";
            }
            else{
               url_3m = "http://ebook.3m.com/library/en/RCPL-query-"+keyword_3m+"-not_in_stock_items-exclude-physical_items-exclude-not_loanable_items-include-search-page-"+page_3m+"/";
            }

            Ajax3m();
        }
    }

    function Ajax3m ()
    {
      $('.loading-3m').appendTo(threeM);
      $('.loading-3m').css('display', 'block');

		var searchs = {
         url: url_3m
      };
      
		$.ajax({
            url:     ajaxUrlModel.replace("%s", "3m"),
            type:    'POST',
            success: threeMLoading,
            data:    searchs
      });



    }



    var overdrive     = $('#ebooks-overdrive');

    if(overdrive.length > 0){
       var search_id     = $('#edit-ebooks-overdrive-last-search');
       var search_cookie = $('#edit-ebooks-overdrive-last-cookie');
       var id            = search_id.attr('value');
       var cookie        = search_cookie.attr('value');
       var session       = cookie.replace('Session=', '').replace('|1|1|', '/10/').replace('|', '/');
       var page          = '2';
       var url           = 'http://myrcpl.lib.overdrive.com/'+session+'/SearchResults.htm?SearchID='+id+'&Page='+page;

       if(overdrive.html().trim() != 'No results were found.'){
	       AjaxOverdrive();
	       hideAudioBooks();
       }
    }


    //searching 3m
    var threeM     = $('#ebooks-3m');
    if(threeM.length > 0){
       var search_keyword = $('#edit-ebooks-3m-last-search');
       var page_3m = '2';
       var keyword_3m = search_keyword.attr('value');
       var url_3m = "http://ebook.3m.com/library/en/RCPL-query-"+keyword_3m+"-not_in_stock_items-exclude-physical_items-exclude-not_loanable_items-include-search-page-"+page_3m+"/";
       if(threeM.html().replace('No results were found.', '').length == threeM.html().length){
          Ajax3m();
       }
    }








    //ebooks_block_search


});
