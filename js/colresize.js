/*
 * -------------------------------------------------------------------------
Colresize plugin
Copyright (C) 2017-2024 by Raynet SAS a company of A.Raymond Network.

http://www.araymond.com
-------------------------------------------------------------------------

LICENSE

This file is part of Column resize plugin for GLPI.

This file is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

GLPI is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with GLPI. If not, see <http://www.gnu.org/licenses/>.
--------------------------------------------------------------------------
*/

// colResize namespace


colResize = {
   freeCol: function (colIndex, colTH) {
      colTH = $(colTH);
      var parentTable = colTH.parents('table');
      var col = parentTable.find('tr td:nth-child(' + (colIndex + 1) + ')');
      col.css('white-space', '');
      colTH.css('white-space', '');

      colTH.css('width', colTH.css('width'));
      col.css('width', '');
   },
   freeCols: function (thElts) {
      $(thElts).each(colResize.freeCol);
   },
   autoResizeCol: function (colIndex, colTH) {
      colTH = $(colTH);
      if (colTH.hasClass('cancel') == false) {
         var parentTable = colTH.parents('table');
         var col = parentTable.find('tr td:nth-child(' + (colIndex + 1) + ')');
         var entityCol = col.find('.entity-badge, .glpi-badge');
         var span = parentTable.find('tr td:nth-child(' + (colIndex + 1) + ') span');
         var originalWidth = parseInt(col.css('width'), 10);
         var originalWidthTable = parseInt(parentTable.css('width'), 10);

         // to force nowrap to adjust at minimal width
         colTH.css('width', '1%');
         col.css('width', '1%');

         entityCol.css('flex-wrap', 'nowrap');
         col.css('white-space', 'nowrap');
         span.css('white-space', 'nowrap');
         colTH.css('white-space', 'nowrap');

         var width = parseInt(colTH.css('width'), 10) + 1;
         parentTable.css('width', originalWidthTable + width - originalWidth);
         colTH.css('max-width', '');
         col.css('white-space', '');
         colTH.css('white-space', '');
         entityCol.css('flex-wrap', '');

         col.css('width', '');
         colTH.css('width', width + 1);

         parentTable.css('table-layout', 'auto');
         colResize.storeWidths(parentTable);
      }
   },
    /*
     * Minimze a column
     * var colIndex: Index of the column in html table
     * var colTH: Column to update
     */
   hideCol: function (colIndex, colTH) {
      colTH = $(colTH);
      var parentTable = colTH.parents('table');
      var col = parentTable.find('tr td:nth-child(' + (colIndex + 1) + ')');
      var entityCol = col.find('.entity-badge, .glpi-badge');
      var bottomThElts = parentTable.find('tr th:last'); //get the TH in the bottom of the table
      var originalWidth = col.outerWidth(true);//col.width();
      var originalWidthTable = parentTable.width();
      var storage = window['localStorage'];
      var th = JSON.parse(storage.getItem(location.pathname));
      var name = colTH[0].innerText.trim();
      if (name && (!storage.getItem(location.pathname) || !th[name])) { //Store the width before update the column in order to be able to extend at the same width in the futur
          colResize.storeOneWidth(name,originalWidth);
      }

      bottomThElts.each(function (index, elt) { //Disable clickable link on the TH in bottom html table
          if (index == colIndex) {
             $(elt).css({
                  'overflow': 'hidden',
                  'text-overflow': 'ellipsis',
                  'white-space': 'nowrap',
                  'width': '5px',
                  'max-width': '15px',
                  'color': 'currentColor',
                  'cursor': 'not-allowed',
                  'text-decoration': 'none',
                  'pointer-events': 'none',
               });
         }
       });
      colTH.css({
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            'width': '5px',
            'max-width': '35px',
       });
      col.css({
            'width': '1px',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'white-space': 'nowrap',
            'max-width': '35px',
         });
      entityCol.css('flex-wrap', 'nowrap');
       parentTable.css({
            'width': (originalWidthTable - originalWidth) + col.outerWidth(true),
         });

       parentTable.find('.ui-resizable-e, .showhover').css('height', parentTable.height());

      colTH.find('div').removeClass('ui-icon ui-icon-minus');
      colTH.find('div').addClass('ui-icon ui-icon-plus');
      colTH.addClass('reduce');
      if (colTH.find('div').hasClass('ui-icon-grip-dotted-vertical')) {
          colTH.parents('table').find('.colresize-col_0').removeClass('ui-icon-grip-dotted-vertical');
          colTH.parents('table').find('.colresize-col_0').addClass('ui-icon-grip-dotted-horizontal');
      }
       colResize.storeOneWidth('table', parentTable.width());
       colResize.storeReduceOneState(colTH, 1);
   },
   /*
   * Resize the width of the column to last known width in the localStorage
   * var colIndex: Index of the column in html table
   * var colTH: Column to update
   */
   showCol: function (colIndex, colTH) {
      colTH = $(colTH);
      var parentTable = colTH.parents('table');
      var col = parentTable.find('tr td:nth-child(' + (colIndex + 1) + ')');
      var entityCol = col.find('.entity-badge, .glpi-badge');
      var originalWidth = col.outerWidth(true);//col.width();
      var originalWidthTable = parentTable.width();
      var name = colTH[0].innerText.trim();
      var storage = window['localStorage'];
      var thWidth = JSON.parse(storage.getItem(location.pathname)); //get data in localstorage

      if (colTH.hasClass('reduce')) {
          colTH.find('div').removeClass('ui-icon ui-icon-plus');
          colTH.find('div').addClass('ui-icon ui-icon-minus');
          colTH.removeClass('reduce');
      }
      parentTable.css({
         
         'width': (parseInt(originalWidthTable, 10) + parseInt(thWidth[colTH.text().trim()], 10) - col.outerWidth(true)),
           });
      
           colTH.css({
               'overflow': '',
               'text-overflow': '',
               'white-space': '',
               'width': thWidth[colTH.text().trim()] + 'px',
               'max-width':''
            });
           col.css({
               'overflow': '',
               'text-overflow': '',
               'white-space': '',
               'max-width': ''
            });
            entityCol.css('flex-wrap', 'wrap');
       parentTable.find('.ui-resizable-e, .showhover').css('height', parentTable.height());
       colResize.storeOneWidth('table', parentTable.width());
       colResize.storeReduceOneState(colTH, 0);
   },
   /*
   * Resize all the columns of the table at last width known in the localStorage
   * var colIndex: Index of the column in html table
   * var colTH: Column to update
   */
   showAllCol: function (colIndex, colTH) {
       colTH = $(colTH);
       if (colTH.hasClass('cancel') == false) {
         var parentTable = colTH.parents('table');
         var col = parentTable.find('tr td:nth-child(' + (colIndex + 1) + ')');
          var link = colTH.find('a');
         if (colTH.hasClass('reduce')) {
            colTH.find('div').removeClass('ui-icon ui-icon-plus');
            colTH.find('div').addClass('ui-icon ui-icon-minus');
            colTH.removeClass('reduce');
         }
         colTH.css({
            'overflow': '',
            'text-overflow': '',
            'white-space': '',
            'width': '',
            'max-width':''
         });
         col.css({
            'overflow': '',
            'text-overflow': '',
            'white-space': '',
            'max-width': '',
         });
         link.prop("disabled", false);
         link.css({
            'color': '',
            'cursor': '',
            'text-decoration': '',
            'pointer-events': ''
         });

         parentTable.css({
            'width': '100%',
            'table-layout':''
         });
         parentTable.find('.ui-resizable-e, .showhover').css('height', parentTable.height());
         colResize.storeOneWidth('table', parentTable.width());
         colResize.storeWidths(parentTable);
         col.find('.entity-badge, .glpi-badge').css('flex-wrap', '');
      }
   },
   originalTableWidth: 0,

   colResize: function (table) {
      table = $(table);
      table.css('width', '100%');
      table.css('max-width', '9000px');
      table.css('margin-left', '0px');
      $('.search_page').find('.tab_glpi').css('margin-left', '0px');

      var thElts = table.find('tr:nth-child(1) th');
      var storage = window['localStorage'];
      var colTH = $(table[0]).children().children().children("th");
      thElts.resizable({
         handles: 'e',
         create: function (event, ui) {
            var draggableDiv = $(event.target).find('.ui-resizable-e');
            // let's add a small grip
            // add icon to the div
            draggableDiv.addClass('ui-icon ui-icon-grip-dotted-vertical');

            if (!draggableDiv.parent().find('div input').hasClass("form-check-input")) { //add button to minimized each column
              
                draggableDiv.parent().append('<div id="mini" style="position: absolute;left:0px;top:0px;" class="ui-icon ui-icon-minus "></div>');
            }

            if ($(event.target).index() == 0) {
               // add icon to the div
               //draggableDiv.addClass('ui-icon ui-icon-grip-dotted-horizontal colresize-col_0');
           
               draggableDiv.addClass('colresize-col_0');

               // cancel resize for this column
               $(event.target).resizable('option', 'cancel', '.cancel');
               $(event.target).addClass('cancel');
               
               // change cursor
               draggableDiv.css('cursor', 'cell');

                //add double-click management to resize complete table
               draggableDiv.on('dblclick', function (event) {
                  var parentsTH = $(this).parents('table').find('th.ui-resizable');
                  $('.search_page .search-results .entity-badge, .glpi-badge span').removeClass('text-nowrap');
                  
                  if ($(this).hasClass('ui-icon-grip-dotted-vertical')) {
                     parentsTH.each(colResize.autoResizeCol);
                     $(this).removeClass('ui-icon-grip-dotted-vertical');
                     $(this).addClass('ui-icon-grip-dotted-horizontal');
                  } else {
                     parentsTH.each(colResize.showAllCol);
                     $(this).removeClass('ui-icon-grip-dotted-horizontal');
                     $(this).addClass('ui-icon-grip-dotted-vertical');
                     colResize.removeWidths();
                     colResize.storeWidths($(this).parents('table'));
                     colResize.storeReduceState($(this).parents('table'));
                     parentsTH.resizable('option', 'disabled', false);
                  }
                  $(window).trigger('resize', $(this).parents('table'));
                  $('.search_page .search-results .entity-badge, .glpi-badge span').css('white-space', '');
                  $('.search_page .search-results .entity-badge, .glpi-badge').css('white-space', '');
               });
            } else {

               // set height
               draggableDiv.css('height', $(event.target).parents('table').css('height'));

               // create new div that will be used when hovering to show the vertical dashed line
               draggableDiv.append('<div class=showhover style="position: absolute; left: 7px; width:0px; height: ' + $(event.target).parents('table').css('height') + ';display: none; border-right: 1px dashed lightgrey;"/>');

               // change cursor
               draggableDiv.css('cursor', 'col-resize');

               draggableDiv.on('click', function (e) {
                  e.stopPropagation();
               });

                //add double-click management to resize selected column

               draggableDiv.on('dblclick', function (event) {
                  var colTH = $(this).parents('th');

                  if (colTH.find('div').hasClass('ui-icon ui-icon-plus')) {
                      colResize.showCol(colTH.index(), colTH);
                      //colResize.autoResizeCol(colTH.index(), colTH);
                  } else {
                      colResize.autoResizeCol(colTH.index(), colTH);
                      var parentTable = $(this).parents('table');
                      $(window).trigger('resize', parentTable);
                      $(event.target).parents('table').find('.colresize-col_0').removeClass('ui-icon-grip-dotted-vertical');
                      $(event.target).parents('table').find('.colresize-col_0').addClass('ui-icon-grip-dotted-horizontal');
                  }
               });

                /* update Alex reduce/resize col */
               $("table.search-results").off().on("click", "#mini", function (event) {
                  event.stopPropagation();
                  var colTD = $(this);
                  var colTH = colTD.parent("th");
                  if (colTD.hasClass('ui-icon ui-icon-minus')) {
                     colResize.hideCol(colTH.index(), colTH);
                     $(event.target).parent().resizable('option', 'disabled', true);
                  } else if (colTD.hasClass('ui-icon ui-icon-plus')) {
                     colResize.showCol(colTH.index(), colTH);
                      $(event.target).parent().resizable('option', 'disabled', false);

                  }
               });
               /**************************************/
               // add mousehover to show the div when mouse is over it
               draggableDiv.hover(function (event) {
                  // show right line
                  $('.showhover').css('display', 'none');
                  $(event.target).find('.showhover').css('display', '');
               }, function (event) {
                  // hide right line
                  $(event.target).find('.showhover').css('display', 'none');
               });

               draggableDiv.parent().find('#mini').hover(function (event) {// show the pointer whenthe pointer hover the minus
                   $(event.target).css('cursor', 'pointer');
               }, function (event) {
                   // hide pointer
                   $(event.target).css('cursor', '');
               });
            }

         },
         start: function (event, ui) {
             colResize.originalTableWidth = parseInt($(event.target).parents('table').css('width'), 10);
         },
         resize: function (event, ui) {
            var parentTable = $(event.target).parents('table');
            var tableHeight = parentTable.css('height');
            parentTable.css('width', colResize.originalTableWidth + (ui.size.width - ui.originalSize.width));
            parentTable.find('.ui-resizable-e').css('height', tableHeight);
            parentTable.find('.ui-resizable-e .showhover').css('height', tableHeight);
         },
         stop: function (event, ui) {
            var parentTable = $(event.target).parents('table');
             parentTable.find('.colresize-col_0').removeClass('ui-icon-grip-dotted-vertical');
            parentTable.find('.colresize-col_0').addClass('ui-icon-grip-dotted-horizontal');
            var name = thElts.parents('table').find('tr th:nth-child(' + (ui.element.index() + 1) + ')')[0].firstChild.data.trim();
            var col = thElts.parents('table').find('tr td:nth-child(' + (ui.element.index() + 1) + ')');
            if (ui.element.hasClass('reduce')) {
                ui.element.find('div').removeClass('ui-icon ui-icon-plus');
                ui.element.find('div').addClass('ui-icon ui-icon-minus');
                ui.element.removeClass('reduce');
                ui.element.css({
                     'overflow': '',
                     'text-overflow': '',
                     'white-space': '',
                  });
                col.css({
                     'overflow': '',
                     'text-overflow': '',
                     'white-space': '',
                  });
                colResize.storeReduceOneState(ui.element, 0);
            }
            colResize.storeOneWidth('table', ui.element.parent().width());
            colResize.storeOneWidth(name,ui.element.width());
         }
      });
      $(window).resize(table, function (event) {
         
         var tableHeight = event.data.css('height');
         event.data.find('div.ui-resizable-e').css('height', tableHeight);
         event.data.find('.showhover').css('height', tableHeight);
      });

      colResize.storageAvailable('localStorage');

      if (storage.getItem(location.pathname + '/reduceState')) { //if array exist, initialize the width of each column
         
          var th = JSON.parse(storage.getItem(location.pathname + '/reduceState'));
         var thWidth = JSON.parse(storage.getItem(location.pathname));

          table.css('width', thWidth['table']);
         var tempWidth = thWidth['table'];

          colResize.initWidths(table);
          thElts.each(function (index, elt) {
             
             if (index > 0) {
                elt = $(elt);
               name = elt[0].firstChild.data.trim();
               if (th[name] == 1) { //if minimize state is 1, we hide the column and disable the resizable functionalities on this column
                     colResize.hideCol(index, elt);
                     $(elt).resizable('option', 'disabled', true);
               }
            }
          });
          table.css('width', tempWidth);
          colResize.storeOneWidth('table', tempWidth);
      } else { //If array doesn't exists, we create
          colResize.storeWidths(table);
          colResize.storeReduceState(table);
      }

      table.find('.ui-resizable-e, .showhover').css({ 'height': $('.tab_cadrehov').height()}); //updates the height of the resizable div to the same height as the html table
   },

   bStorageAvailable: false,

   storageAvailable: function (type) {
      try {
         var storage = window[type],
            x = '__storage_test__';
         storage.setItem(x, x);
         storage.removeItem(x);
         colResize.bStorageAvailable = true;
         return true;
      } catch (e) {
         return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
      }
   },
    /*
     * Initialize the widths of table columns when page is loaded and if array location.pathname/reduceState exist in localStorage
     * var table: html table to scan
     */
   initWidths: function (table) {
       var storage = window['localStorage'];
       var thWidths = JSON.parse(storage.getItem(location.pathname)); // Get array with the width of the columns
      var thState = JSON.parse(storage.getItem(location.pathname + '/reduceState')); //Get array with the minimize state of the columns
      if (colResize.bStorageAvailable) {
         table = $(table);
         if (thWidths) {
            table.find('th.ui-resizable').each(function (index, elt) {
               elt = $(elt);
               name = elt[0].firstChild.data.trim();
               if (index > 0) {
                  if (thState[name] == 0) {
                        elt.css('width', thWidths[name]);
                  }
               }
             });
            table.find('.colresize-col_0').removeClass('ui-icon-grip-dotted-vertical');
            table.find('.colresize-col_0').addClass('ui-icon-grip-dotted-horizontal');
            $(window).trigger('resize', table);
         }
      }
   },
    /*
     * Store the Width of each table column
     * var table: html table to scan
     */
   storeWidths: function (table) {
      if (colResize.bStorageAvailable) {
         table = $(table);
         var thElts = table.find('th.ui-resizable');
         var storage = window['localStorage'];
         var thWidths = {};
         thWidths['table'] = table.css('width');
         thElts.each(function (index, elt) {
            elt = $(elt);
            name = elt[0].firstChild.data.trim();
            if (index > 0) {
                thWidths[name] = elt.outerWidth();
            }
         });
         var json = JSON.stringify(thWidths);
         storage.setItem(location.pathname, json);
      }
   },
    /*
    Store the width of one column (in px) in the localStorage
    var name: index of associative array. In general it's the param "sort"  of link in the TH. If header does not a link we use the text. WARNING: If the language change it does not work well
    var width: Save the with before minimizing the column
    */
   storeOneWidth: function(name, width){
       var storage = window['localStorage'];
       var thWidth = {};
      if (storage.getItem(location.pathname)) {
          var thWidth = JSON.parse(storage.getItem(location.pathname));
      }
       thWidth[name] = width;
       var json = JSON.stringify(thWidth);
       storage.setItem(location.pathname, json);
   },
    /*
     * Initialise the minimize state to 0 for each column.
     * Store the array in the localStorage
     * var table: html table to scan
     */
   storeReduceState: function (table) {
      if (colResize.bStorageAvailable) {
          table = $(table);
          var thElts = table.find('th.ui-resizable');

          var storage = window['localStorage'];
          var th = {};
         thElts.each(function (index, elt) {
            elt = $(elt);
            name = elt[0].firstChild.data.trim();
            if (index > 0) {
               th[name] = 0;
            }
          });
          var json = JSON.stringify(th);
          storage.setItem(location.pathname+'/reduceState', json);
      }
   },
    /*
     * Store state (minimize:1 or no:0) of one column
     * var col: Column of a table
     * var val: 1: Column is minimized. 0:Column is not minimized
     */
   storeReduceOneState: function (col,val) {
      var storage = window['localStorage'];
      
      var name = col[0].firstChild.data.trim();
       var th = JSON.parse(storage.getItem(location.pathname + '/reduceState'));
       th[name] = val;
       storage.setItem(location.pathname + '/reduceState', JSON.stringify(th));
   },
   removeWidths: function () {
      if (colResize.bStorageAvailable) {
         var storage = window['localStorage'];
         storage.removeItem(location.pathname);
      }
   },
   getLocalStorage: function (nameStorage) {
       var storage = window['localStorage'];
       var th = JSON.parse(storage.getItem(nameStorage));
       return th;
   },
}


var myObserver = new MutationObserver(mutationhandler);
var obsconfig = {
   childList: true,
   characterData: false,
   attributes: true,
   subtree: true,
};

$("div.search_page").each(function () {
   myObserver.observe(this, obsconfig);
});

//called when an element is an to the dom
function mutationhandler(mutationRecords) {
   var elts = $("table.search-results");
   if (elts.not(".colResize").length > 0) {
      elts.addClass("colResize");
      var colRes = new colResize.colResize($('table.search-results'));
   }
   $('.search_page div.card-footer.search-footer').css('z-index', 1022);
   $('.search_page .search-results .entity-badge, .glpi-badge span').removeClass('text-nowrap');
   for (mutation of mutationRecords) {
      if ($(mutation.target).is('th.ui-resizable.ui-resizable-resizing')) {
         if ($(mutation.target).css('pointer-events') != 'none') {
            $(mutation.target).css('pointer-events', 'none');
            $('body').css('cursor', 'pointer');
         }
      } else if ($(mutation.target).is('th.ui-resizable') && !$(mutation.target).hasClass('ui-resizable-resizing')) {
         if ($(mutation.target).css('pointer-events') == 'none') {
            $(mutation.target).css('pointer-events', '');
            $('body').css('cursor', 'auto');
         }
      }
   }
}

