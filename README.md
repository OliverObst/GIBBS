# GIBBS
Gliders’ in-browser basic soccer monitor, a web based player for RoboCup log files

    rcg2html converter

    version: 2.0
    Authors: Edward Moore, Oliver Obst
    Date:    05/05/13
    License: GPL3

***********************************************

1. OVERVIEW
===================


This is a set of scripts to help display rcg logfiles from RoboCup
soccer simulation league in a web browser. The idea of this HTML5
logplayer is to avoid the use of flash, since compiling the original
flash converter by Thilo Girmann requires a proprietary library that
is no longer available. 

If you find these scripts useful, e.g., for showing matches on your
web page, please do cite our team description report in your papers
and/or team descriptions. This report is an extended version of the
original Gliders2012 team report, the reference is as follows:


Gliders2012: Development and Competition Results
Edward Moore, Oliver Obst, Mikhail Prokopenko, Peter Wang, Jason Held
arXiv:1211.3882
http://arxiv.org/abs/1211.3882


It's perfectly OK to modify and re-distribute modified versions of
this tool. If you do, please keep the message above intact. See also
the file LICENSE for details.

If you find bugs or have suggestions for improvements, or would like
to contribute fixes or improvements, please send us an email
(oliverobst@gmail.com). We will try to incorporate your patches and
suggestions in a next version.


2. SETUP
===================

There is a number of steps to follow initial installation of these
scripts. Files can be installed on a web server by simply copying (run
in a web browser).

The tool to convert log files into the *.replay files required by our
log player needs to be compiled first in order to be run.


2.1 Compiling the Converter

In the "converter" subdirectory, there is a very simple Makefile that 
should do the job. You will need the rcgbase installed that comes with
the server. Just do:

    make

2.2 Converting rcg[.gz] files 

To convert .rcg(.gz) files into a .replay (converted game replay) is 
now very simple:

  The rcg2replay program will convert .rcg or gzipped rcg files into text, 
  e.g.,

  rcg2replay 201203051705-TeamEI_8-vs-HELIOS_base_1.rcg.gz > 201203051705-TeamEI_8-vs-HELIOS_base_1.replay


Repeat for all games you want to show on your web page.


2.3 Installing the scripts on the web server

 - Copy all generated .replay files into some directory on your web
   server (for minimal changes, retain the directory structure coming
   with these scripts). 

 - play.php is the main file that starts up the logplayer when invoked 
   using a browser.  Copy this file into the desired directory.

   This file should be modified to include all the .replay files. If
   you copied them into a different subdirectory, make sure to include
   the correct path. See also online examples at
   http://www.oliverobst.eu/research/robotics-gliders2012-simulation-league-robocup-team/robocup-2012

 - Copy the scripts directory and the *.css files. 
   play.php includes 3 javascript files, and 2 CSS style sheets. All 3
   javascript files are expected in a subdirectory "scripts". This
   subdirectory should be in the same directory as play.php. The 2 CSS
   files are expected to be in the same directory as play.php. 

 - Copy the images directory.
   The style sheet jquery-ui.css expects some icons and graphics in
   the "images" subdirectory (which again should be in the same
   directory as play.php).


3. PLAYING BACK
===================

The example web page (play.php) gives you a drop-down menu to select
available games. To play back a game, it needs to be transferred to
the client side. Currently, the typical size of a replay file is
4-5MB.  This transfer can take time and may make the browser seem like
it has frozen. A notice to say that the file is being loaded would
probably be nice - feel free to add this or any other feature to the
php script. 


4. DEVELOPMENT
===================

Further development of the rcg2html tool may change the format of
replay files to reduce size.
