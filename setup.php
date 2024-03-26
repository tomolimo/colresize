<?php
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


// ----------------------------------------------------------------------
// Original Author of file: Olivier Moron
// Purpose of file: Provides frame for colresize
// ----------------------------------------------------------------------

define ("PLUGIN_COLRESIZE_VERSION", "2.1.1");
// Minimal GLPI version, inclusive
define('PLUGIN_COLRESIZE_MIN_GLPI', '10.0');
// Maximum GLPI version, exclusive
define('PLUGIN_COLRESIZE_MAX_GLPI', '10.1');


define('PLUGIN_COLRESIZE_ROOT', Plugin::getPhpDir('colresize'));

function plugin_init_colresize() {
   global $PLUGIN_HOOKS,$LANG,$CFG_GLPI;
   $plug = new Plugin;

   Plugin::registerClass('PluginColresizeUser',
                         [
                         'addtabon' => ['Preference', 'User']
                         ]);

   $PLUGIN_HOOKS['csrf_compliant']['colresize'] = true;
   // Add specific files to add to the header : javascript or css
   if ($plug->isActivated('colresize')) {
      $colresize = new PluginColresizeUser();
      if ($colresize->getFromDBByCrit(['users_id'=>Session::getLoginUserID(), 'is_active' => 1])) {
         $PLUGIN_HOOKS['add_javascript']['colresize'] = ['js/colresize.js', 'lib/jquery-ui/jquery-ui.js'];
         $PLUGIN_HOOKS['add_css']['colresize'] = ['lib/jquery-ui/jquery-ui.css'];
      }
   }
}


// Get the name and the version of the plugin
function plugin_version_colresize() {

   return ['name'           => 'Column resize',
           'version'        => PLUGIN_COLRESIZE_VERSION,
           'author'         => 'Olivier Moron',
           'license'        => 'GPLv2+',
           'homepage'       => 'https://forge.glpi-project.org/projects/colresize/',
           'requirements'   => [
                        'glpi'   => [
                              'min' => PLUGIN_COLRESIZE_MIN_GLPI,
                              'max' => PLUGIN_COLRESIZE_MAX_GLPI
                        ],
            ]
   ];
}


// Optional : check prerequisites before install : may print errors or add to message after redirect
function plugin_colresize_check_prerequisites() {

   if (version_compare(GLPI_VERSION, PLUGIN_COLRESIZE_MIN_GLPI, 'lt')
        && version_compare(GLPI_VERSION, PLUGIN_COLRESIZE_MAX_GLPI, 'ge')) {
      echo "This plugin requires GLPI >= " . PLUGIN_COLRESIZE_MIN_GLPI . " and < " . PLUGIN_COLRESIZE_MAX_GLPI;
      return false;
   }
   return true;
}


// Check configuration process for plugin : need to return true if succeeded
// Can display a message only if failure and $verbose is true
function plugin_colresize_check_config($verbose = false) {

   return true;
}
