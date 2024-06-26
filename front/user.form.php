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

include ("../../../inc/includes.php");


$pref = new PluginColresizeUser();
if (isset($_POST["update"])) {
   $pref->update($_POST);

   Html::back();
}

Html::redirect($CFG_GLPI["root_doc"]."/front/preference.php?forcetab=".
             urlencode('PluginColresizeUser$1'));
