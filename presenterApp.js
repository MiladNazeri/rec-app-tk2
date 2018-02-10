// JavaScript File
"use strict";

//
//  presenterApp.js
//  tablet-sample-app
//
//  Created by Mattias Lundbäck on Feb 6 2018.
//  Copyright 2017 Ekonomismus AB.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function() {
	// Every great app starts with a great name (keep it short so that it can fit in the tablet button)
	var APP_NAME = "PRESENTER";
	// Link to your app's HTML file
	var APP_URL = Script.resolvePath("./tablet.html")
	// Path to the icon art for your app
    var APP_ICON = "https://sinatra4-ekonomism.c9users.io/projektor.svg";

    // Get a reference to the tablet
	var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");

	// Spara referenser till presentationer
	var presentationList = [];

	// "Install" your cool new app to the tablet
	// The following lines create a button on the tablet's menu screen
	var button = tablet.addButton({
        icon: APP_ICON,
        text: APP_NAME
    });

	// When user click the app button, we'll display our app on the tablet screen
	function onClicked() {
		tablet.gotoWebScreen(APP_URL);
	}
    button.clicked.connect(onClicked);

    // Helper function that gives us a position right in front of the user
    function getPositionToCreateEntity() {
    	var direction = Quat.getFront(MyAvatar.orientation);
    	var distance = 4;
    	var position = Vec3.sum(MyAvatar.position, Vec3.multiply(direction, distance));
    	position.y += 2;
    	return position;
    }

    // Handle the events we're recieving from the web UI
    function onWebEventReceived(event) {
    	print("presenterApp.js received a web event:" + event);

        // Converts the event to a JavasScript Object
    	if (typeof event === "string") {
            event = JSON.parse(event);
        }

        if (event.type === "click") {
        	// Define the entity properties of for each of the gemstone, then add it to the scene
        	var properties = {
        		"type": "Web",
        		"position": getPositionToCreateEntity(),
        		"userData": "{\"grabbableKey\":{\"grabbable\":true}}",
        		"sourceUrl": "https://slides.com/ekonomism/test/live"
        	};
        	if (event.data  === "open") {
                properties.name = "Presentation";
        		properties.shape = "Dodecahedron";
        		properties.color = {
                    "blue": 122,
                    "green": 179,
                    "red": 16
                };
                properties.dimensions = {
                    "x": 7,
                    "y": 4,
                    "z": 0.20000000298023224
                };
                var id=Entities.addEntity(properties);
                presentationList.push(id);
                var SLIDES="http://slides.com/miladnazeri/test/speaker"
                tablet.gotoWebScreen(SLIDES);
        	} else if (event.data  === "close") {
                print("Deleting presentations ...");
                while(presentationList.length > 0)
                 {
                   Entities.deleteEntity(presentationList.pop());
                 }
                ;
        	} else if (event.data  === "openslides") {
        	    var newProperty = { "sourceUrl": "https://slides.com/ekonomism/test/live" };
        	    var last_element = presentationList[presentationList.length - 1];
                Entities.editEntity(last_element, newProperty);
        	} else if (event.data  === "back") {
                properties.name = "Quartz";
        		properties.shape = "Octahedron";
        		properties.color = {
                    "blue": 245,
                    "green": 142,
                    "red": 216
                };
                properties.dimensions = {
                    "x": 0.20000000298023224,
                    "y": 0.339866042137146,
                    "z": 0.20000000298023224
                };
                Entities.addEntity(properties);
        	}
        }
    }
    tablet.webEventReceived.connect(onWebEventReceived);

	// Provide a way to "uninstall" the app
	// Here, we write a function called "cleanup" which gets executed when
	// this script stops running. It'll remove the app button from the tablet.
	function cleanup() {
        tablet.removeButton(button);
	}
    Script.scriptEnding.connect(cleanup);
}());
