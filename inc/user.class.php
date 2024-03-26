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
/**
 * user short summary.
 *
 * user description.
 *
 * @version 1.0
 * @author gauberta
 */
class PluginColresizeUser extends CommonDBTM
{
   /**
    * Summary of getTabNameForItem
    * @param CommonGLPI $item         is item
    * @param mixed      $withtemplate is using a template
    * @return array
    */
   function getTabNameForItem(CommonGLPI $item, $withtemplate = 0) {
      global $LANG;

      return [ 'colresizecolresize' => __('Colresize', 'colresize')];

   }

   /**
    * Summary of displayTabContentForItem
    * @param CommonGLPI $item         is the item
    * @param mixed      $tabnum       is the tab num
    * @param mixed      $withtemplate is using a template
    * @return boolean
    */
   static function displayTabContentForItem(CommonGLPI $item, $tabnum = 1, $withtemplate = 0) {

      if (in_array( $item->getType(), [ 'Preference', 'User' ])) {
         $pref = new self();
         $user_id = ($item->getType()=='Preference'?Session::getLoginUserID():$item->getID());
         $pref->showForm($user_id);
      }
      return true;
   }

   /**
    * Summary of showForm
    * @param mixed $user_id is the user id
    * @param mixed $options some options
    * @return void
    */
   function showForm($user_id, $options = []) {
      global $LANG;

      $target = $this->getFormURL();
      if (isset($options['target'])) {
         $target = $options['target'];
      }

      $colResizeID = $this->getIDFromUserID( $user_id );
      if ($user_id) {
         if (!$colResizeID) {
            $this->add( [ 'users_id' => $user_id] );
            $colResizeID = $this->getID();
         }
         $this->getFromDB( $colResizeID );
      }
      // else {
      //    return;
      // }

      echo "<form action='".$target."' method='post'>";
      echo "<input type=hidden name=users_id value='$user_id'/>";
      echo "<input type=hidden name=id value='$colResizeID'/>";
      echo "<table class='tab_cadre_fixe'>";

      echo "<tr class='tab_bg_2'>";
      echo "<td>".__('Activate plugin?', 'colresize')."</td><td>";

      $choices = [__('No'),__('Yes')];
      Dropdown::showFromArray('is_active', $choices, ['value' => $this->fields['is_active']]);

      echo "</td></tr>";

      echo "<tr class='tab_bg_2'>";
      echo "<td colspan='4' class='center'>";
      echo "<input type='submit' name='update' class='submit' value=\"".__('Save')."\">";
      echo "</td></tr>";

      echo "</table>";
      Html::closeForm();
   }


   /**
    * Summary of getIDFromUserID
    * @param mixed $user_id is the user id
    * @return mixed returns id of record if found, false otherwise
    */
   function getIDFromUserID($user_id) {
      $found = $this->find(['users_id' => $user_id]);
      if ($found) {
         $first_found = array_pop($found);
         return $first_found['id'];
      }
      return false;
   }
}