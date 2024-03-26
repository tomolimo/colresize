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
// Purpose of file: Provide frame for colresize
// ----------------------------------------------------------------------


// Install process for plugin : need to return true if succeeded
function plugin_colresize_install() {
   global $DB;

   if(!$DB->TableExists("glpi_plugin_colresize_users")){
      $query = "CREATE TABLE `glpi_plugin_colresize_users` (
                  `id` int unsigned NOT NULL AUTO_INCREMENT,
                  `users_id` int unsigned NOT NULL DEFAULT '0',
                  `is_active` tinyint NOT NULL DEFAULT '0',
                  PRIMARY KEY (`id`),
                  UNIQUE INDEX `users_id` (`users_id`));";
      $DB->queryOrDie($query, $DB->error());
   }

   return true;
}


// Uninstall process for plugin : need to return true if succeeded
function plugin_colresize_uninstall() {

   return true;
}

