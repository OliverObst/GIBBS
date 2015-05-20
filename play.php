<!-- 
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
-->
<html>
<head>
	<title>Robocup Online Player</title>
	<script language="JavaScript" src="scripts/jquery.js"></script>
	<script language="JavaScript" src="scripts/jquery-ui.js"></script>
	<script language="JavaScript" src="scripts/player.js"></script>
	<link rel="stylesheet" type="text/css" href="jquery-ui.css" />
	<link rel="stylesheet" type="text/css" href="logplay.css" />
</head>
<body>

	<div id="Notes">
		HTML5 Canvas is Required. You should get an error if it's not. <br />
	</div>

	<div id="Loader">
		Replay to load: 
		<select onchange="Start(this.value); Play();" id="fileSelect">
			<option value="">Please Select a game to play</option>
                        <?php
                                $handle = opendir('./replays');
                                while (false !== ($entry = readdir($handle)))
                                        if (substr($entry,-7) == ".replay")
                                                echo "<option value=\"./replays/". $entry ."\">". $entry ."</option>\n";
                        ?>
		</select>
	</div>

	<div id="controls">
		<div id="buttons" class="ui-widget ui-helper-clearfix">
			<div class="ui-state-default ui-corner-all" onclick="Restart();"><span class="ui-icon ui-icon-seek-first"></span></div>
			<div class="ui-state-default ui-corner-all" onclick="PrevGoal();"><span class="ui-icon ui-icon-arrowreturnthick-1-w"></span></div>
			<div class="ui-state-default ui-corner-all" onclick="RPlayOne();"><span class="ui-icon ui-icon-seek-prev"></span></div>
			<div class="ui-state-default ui-corner-all" onclick="Play();"><span class="ui-icon ui-icon-play"></span></div>
			<div class="ui-state-default ui-corner-all" onclick="Pause();"><span class="ui-icon ui-icon-pause"></span></div>
			<div class="ui-state-default ui-corner-all" onclick="PlayOne();"><span class="ui-icon ui-icon-seek-next"></span></div>
			<div class="ui-state-default ui-corner-all" onclick="NextGoal();"><span class="ui-icon ui-icon-arrowreturnthick-1-e"></span></div>
			<div class="ui-state-default ui-corner-all" onclick="End();"><span class="ui-icon ui-icon-seek-end"></span></div>
		</div>
		<div id="cyclesSlider"></div>
	</div>

	<div id="game">
		<div id="Lteam">LEFT&nbsp;&nbsp;0</div>
		<div id="cycles">0 </div>
		<div id="Rteam">RIGHT&nbsp;&nbsp;0</div>
	
		<canvas id="field" width="800" height="514">Your browser doesn't support HTML5 canvas.</canvas>
    </div>
</body>
</html>
