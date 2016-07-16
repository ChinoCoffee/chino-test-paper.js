/**
 * manga.js
 */


/////////////////////////////////////
//     MangaEye
/////////////////////////////////////

function MangaEye(direction) {
    // [TODO] refactoring
    this.direction = direction;
}

MangaEye.prototype.setup = function() {

};

MangaEye.prototype.draw = function() {
    this.sclera();
    this.iris();
    this.eyebrow();
    this.pupil();
};

MangaEye.prototype.eyebrow = function() {

};

MangaEye.prototype.eyelid_fold_line = function() {

};

MangaEye.prototype.upper_lash_line = function() {

};

MangaEye.prototype.lower_lash_line = function() {

};

MangaEye.prototype.sclera = function() {

};

MangaEye.prototype.iris = function() {

};

MangaEye.prototype.highlight = function() {

};

MangaEye.prototype.pupil = function() {

};


/////////////////////////////////////
//     Character
/////////////////////////////////////

function Character(name, options) {
    this.eye_l = new MangaEye('L');
    this.eye_r = new MangaEye('R');
    this.pupillary_distance = options.pupillary_distance || 320;
}

Character.prototype.drawHairBack = function(_hairColor, numDiv) {
    numDiv = (numDiv !== undefined) ? numDiv: 9;

    var result = new Group();
    var interpolator = new TwoBezierInterpolator(
        getItem("hair-back-1"), getItem("hair-back-2")
    );

    var stops = [
        [[1, 1],  0.0],
        [[13, 13],  0.19],
        [[26, 26],  0.54],
        [[3, 3],  1.0]
    ];

    var interpolated, g, outline, highlight;

    for (var i = 0; i <= numDiv; i++) {

        if (i == Math.floor(numDiv / 2) || i == Math.ceil(numDiv / 2)) {
            // [TODO]
            // There is a mysterious bug about `Can't scale curve`
            continue;
        }

        interpolated = interpolator.interpolate(i / numDiv);
        g = new GraduatedOutline(interpolated);

        g.setNumDiv(9);

        outline = g.getOutline(stops);  //, true);

        var hairColor = _hairColor.clone();
        var strokeColorAlpha;

        if (i == 0 || i == numDiv) {
            hairColor.brightness = hairColor.brightness - 0.02;
            strokeColorAlpha = 70;
        } else {
            hairColor.brightness = hairColor.brightness - 0.19;
            strokeColorAlpha = 10;
        }

        outline.set({
            fillColor: hairColor,
            strokeColor: c(50, 50, 50, strokeColorAlpha),
            strokeWidth: 1,
            strokeCap: 'butt',
        });
        result.addChild(outline);

        if (i < numDiv / 2) {
            highlight = g.getOutline(zeropad(stops, true));
        } else {
            highlight = g.getOutline(zeropad(stops));
        }

        var stopAlpha = (i == 0 || i == numDiv) ? 105: 20;
        highlight.set({
            fillColor: {
                stops: [
                    [c(245, 255, 255, stopAlpha), 0.0],
                    [c(245, 245, 255, 10), 0.95],
                    [c(180, 220, 250, 0), 1.0],
                ],
                origin: highlight.bounds.bottomCenter,
                destination: highlight.bounds.topCenter,
            }
        });
        highlight.insertAbove(outline);
        result.addChild(highlight);

    }

    return result;
};


Character.prototype.drawHairFronts = function(hairColor) {
    var tip = 0;

    function reverse(stops) {
        return stops.map(function(s) {
            return [[s[0][1], s[0][0]], s[1]];
        });
    }
    var r = reverse;

    var T = [
      [[1, 1],  0.0],
      [[6, 14],  0.5],
      [[1, 0],  1.0]
    ];
    var S = [   // side hairs
        [[1, 1],  0.0],
        [[11, 11],  0.26],
        [[15, 13],  0.4],
        [[16, 16],  0.5],
        [[14, 15],  0.81],
        [[1, 1],  1.0]
    ];
    var L = [   // side hairs
        [[1, 1],  0.0],
        [[11, 34],  0.13],
        [[11, 46],  0.26],
        [[11, 32],  0.6],
        [[8, 22],  0.86],
        [[6, 13],  0.92],
        [[1, 1],  1.0]
    ];
    var F = [   // front hairs
        [[1, 1],  0.0],
        [[25, 36],  0.5],
        [[21, 28],  0.74],
        [[1, 0],  1.0]
    ];

    var hairDict = {
        "hair-l-0": r(T),
        "hair-l-1": S,
        "hair-l-2": r(L),

        "hair-l-3": r(F),
        "hair-l-4": F,
        "hair-l-5": F,

        "hair-c-1": F,
        "hair-c-2": r(F),

        "hair-r-0": T,
        "hair-r-1": r(S),
        "hair-r-2": L,

        "hair-r-3": F,
        "hair-r-4": r(F),
        "hair-r-5": r(F),
        "hair-r-6": r(F),
    };

    var hair_fronts = new Group();
    var hair_forehead_shadow = new Group();
    var hair_fronts_outline = new Group();
    var hair_fronts_shadow = [];

    var hair_forehead_shadow_list = [
        "hair-l-1",
        "hair-l-2",
        "hair-l-3", "hair-l-4", "hair-l-5",
        "hair-c-1", "hair-c-2",
        "hair-r-3", "hair-r-4", "hair-r-5", "hair-r-6",
        "hair-r-2",
        "hair-r-1",
    ];

    var hair_fronts_outline_list = [
        'hair-l-2',
        'hair-r-2',
        'hair-r-5',
        'hair-c-2', 'hair-l-5'
    ];

    /*
     // for debug
    var hairDict = {"hair-l-1": S};
    var hair_forehead_shadow_list = ["hair-l-1"];
    var hair_fronts_outline_list = ["hair-l-1"];
     */

    for (var obj in hairDict) {
        var h = getItem(obj);
        h.strokeWidth = 0;
        var path = new GraduatedOutline(getItem(obj));
        path.setNumDiv(12 + Math.ceil(path.length() / 55));

        var outline = path.getOutline(hairDict[obj]);   //, true);  // for debug drawing
        //var outline = path.getOutline(hairDict[obj], true);  // for debug drawing
        hair_fronts.addChild(outline);

        if (hair_fronts_outline_list.indexOf(obj) != -1) {
            var cloned = outline.clone();
            cloned.name = obj;
            hair_fronts_outline.addChild(cloned);
        }

        var path_highlight;

        if (obj != 'hair-l-1' && obj != 'hair-r-1') {
            hair_fronts_shadow.push(path.getOutline(zeropad(hairDict[obj])));
            path_highlight = path.getOutline(zeropad(hairDict[obj], true));
        } else {
            path_highlight = path.getOutline(zeropad(hairDict[obj]));
        }

        path_highlight.set({
            fillColor: {
                stops: [
                    [c(180, 220, 250, 0), 0.0],
                    [c(245, 245, 255, 40), 0.45],
                    [c(255, 255, 255, 122), 0.84],
                    [c(255, 255, 255, 1), 1.0],
                ],
                origin: path_highlight.bounds.bottomCenter,
                destination: path_highlight.bounds.topCenter,
            }
        });

        if (hair_forehead_shadow_list.indexOf(obj) !== -1) {
            var clone = outline.clone();
            if (obj == "hair-l-2" || obj == "hair-r-2") {
                clone.translate(0, -5);
            }
            clone.strokeWidth = 0;
            hair_forehead_shadow.addChild(clone);
        }
    }
    hair_forehead_shadow = merge(hair_forehead_shadow);
    hair_forehead_shadow.scale(1.014, 0.997).translate(0, 9);
    hair_forehead_shadow.fillColor = c(150, 80, 80, 30);
    hair_forehead_shadow.insertBelow(hair_fronts);

    hair_fronts_outline_list.forEach(function(name) {
        var hairStrokeColor;
        if (name == 'hair-l-2' || name == 'hair-r-2') {
            hairStrokeColor = c(200, 200, 250, 120);
        } else {
            hairStrokeColor = c(250, 150, 150, 30);
        }

        var e = hair_fronts_outline.children[name];
        e.set({
            strokeWidth: 1,
            strokeColor: {
                stops: [
                    [hairStrokeColor, 0.0],
                    [c(50, 150, 250, 110), 0.8],
                    [c(250, 80, 80, 20), 0.93],
                    [c(250, 80, 80, 0), 0.97],
                ],
                origin: e.bounds.bottomCenter,
                destination: e.bounds.topCenter,
            }
        });
        e.bringToFront();
    });

    //hairColor.alpha = 0.92;
    var hair_fronts_all = merge(hair_fronts);
    hair_fronts_all.set({
        fillColor: hairColor,
        strokeColor: c(50, 50, 50, 50),
        strokeWidth: 1,
        strokeCap: 'butt',
    });
    hair_fronts_all.insertAbove(hair_fronts);

    // hair fronts shadow
    var hair_fronts_shadow_group = new Group();
    for (var i = 0; i < hair_fronts_shadow.length; i++) {
        var path = hair_fronts_shadow[i];
        path.fillColor = {
            stops: [
                [c(50, 50, 50, 35), 0.0],
                [c(180, 220, 250, 10), 0.65],
                [c(180, 220, 250, 0), 0.69],
            ],
            origin: path.bounds.bottomCenter,
            destination: path.bounds.topCenter,
        };
        path.insertAbove(hair_fronts_all);
        hair_fronts_shadow_group.addChild(path);
    }

    var hair_highlight = getItem("hair-highlight");
    hair_highlight.strokeWidth = 0;
    hair_highlight.fillColor = {
        stops: [
            [c(255, 255, 255, 230), 1.0],
            [c(255, 255, 255, 190), 0.0],
        ],
        origin: hair_highlight.position,
        destination: hair_highlight.bounds.topRight,
    };
    hair_highlight.insertAbove(hair_fronts_shadow_group);

    // X
    ["l", "r"].forEach(function(direction) {
        var X = getItem("X-" + direction);
        X.set({
            fillColor: {
                stops: [
                    [c(85, 85, 85, 255), 0.0],
                    [c(95, 95, 95, 200), 1.0],
                ],
                origin: X.position,
                destination: X.bounds.rightCenter
            },
            strokeColor: c(150, 150, 150, 120),
            strokeWidth: 1,
        });
        X.insertAbove(hair_fronts_all);
        //X.bringToFront();
    });

    return hair_fronts_all;
}


Character.prototype.bind = function(item) {
    var allItems = paper.project.getItems({})[0];
    allItems.strokeWidth = 1;

    var dress = getItem("dress");
    dress.strokeColor = c(80, 80, 80, 80);
    dress.fillColor = c(215, 250, 255, 255);
    dress.insertAbove(getItem("shoulder"));

    var hairColor = c(215, 227, 255, 240);
    //hairColor.brightness = hairColor.brightness - 0.035;
    hairColor.brightness = hairColor.brightness - 0.015;
    hairColor.saturation = hairColor.saturation + 0.135;
    var hair_fronts = this.drawHairFronts(hairColor);

    var hair_back = this.drawHairBack(hairColor);
    hair_back.sendToBack();

    var facelineColor = c(170, 110, 95, 120);

    getItem("collarbone-l").strokeColor = c(225, 180, 180, 180);
    getItem("collarbone-r").strokeColor = c(225, 180, 180, 180);

    ["ear-l", "ear-r", "face", "neck-l", "neck-r", "shoulder"].forEach(function(item) {
        getItem(item).strokeColor = facelineColor;
    });

    var eyeLineGroup = new Group();
    ["eyebrow", "eyelid-fold-line", "upper-lash-line"].forEach(function(i) {
        ["l", "r"].forEach(function(direction) {
            var item = getItem(i + "-" + direction);
            item.strokeColor = c(30, 20, 20, 100);
            item.strokeWidth = 1.1;
            eyeLineGroup.addChild(item);
        });
    });

    var mouth = getItem("mouth");
    mouth.strokeWidth = 1.7;
    mouth.strokeColor = c(160, 90, 120, 110);
    mouth.strokeCap = 'round';
    getItem("nose").strokeWidth = 1.5;
    getItem("nose").strokeColor = facelineColor;

    var faceColor = getItem("face").fillColor.clone();
    faceColor.brightness = faceColor.brightness + 0.02;
    getItem("face").fillColor = faceColor;
    getItem("shoulder").fillColor = faceColor;

    var red_cheeks = [];
    ["l", "r"].forEach(function(direction) {
        var _red_cheek = getItem("red-cheek-" + direction);
        var red_cheek = _red_cheek.toPath().scale(4.0);
        _red_cheek.visible = false;

        red_cheek.strokeColor = null;
        red_cheek.strokeWidth = 0;
        var red_cheek_grad = new Gradient(
            [   // stops
                [c(255, 200, 200, 160), 0.0],
                [c(faceColor.red * 255, faceColor.green * 255, faceColor.blue * 255, 0), 0.7],
            ],
            true    // radial
        );

        red_cheek.fillColor = new Color(
            red_cheek_grad,
            red_cheek.position,   // origin
            red_cheek.bounds.rightCenter   // destination
        );
        red_cheeks.push(red_cheek);

        //   ///
        var drunk = function(pos, amp) {
            amp = amp || 3;
            var dx = amp * (Math.random() - 0.5);
            var dy = amp * (Math.random() - 0.5);
            return pos.add(dx, dy);
        };

        for (var i = -1; i <= 1; i++) {
            var pos = red_cheek.position.add(i * 13, 0);
            pos = drunk(pos);

            var line = new Path.Line({
                from: drunk(pos.add( 8, -4)),
                to:   drunk(pos.add(-8,  4)),
                strokeColor: c(255, 97, 97, 170),
                strokeWidth: 1,
                strokeCap: 'round',
            });
        }
    });

    var face = getItem("face");

    // hair transparent gradient
    var hair_fronts_grad = hair_fronts.clone();
    var face_grad = face.clone();
    face_grad.position = face_grad.position.add([0, 50]);
    face_grad.scale(3.8);
    face_grad.set({
        strokeColor: null,
        strokeWidth: 0,
        fillColor: {
            gradient: {
                stops: [
                    [c(faceColor.red * 355, faceColor.green * 215, faceColor.blue * 205, 160), 0.0],
                    [c(faceColor.red * 255, faceColor.green * 255, faceColor.blue * 255, 0), 0.5],
                ],
                radial: true,
            },
            origin: face_grad.position,
            destination: face_grad.bounds.rightCenter,
        }
    });
    var hair_fronts_grad_group = new Group([hair_fronts_grad, face_grad]);
    hair_fronts_grad_group.clipped = true;


    face.strokeWidth = 2;
    var faceClip = face.clone();
    red_cheeks.unshift(faceClip);
    red_cheeks.unshift(face);
    var faceGroup = new Group(red_cheeks);
    faceGroup.clipped = true;
    faceGroup.insertAbove(hair_back);

    // forehead shadow
    var _forehead_shadow = getItem("forehead-shadow");
    var forehead_shadow = _forehead_shadow.scale(6.0).toPath();
    _forehead_shadow.visible = false;

    forehead_shadow.set({
        strokeWidth: 0.0,
        fillColor: {
            gradient: {
                stops: [
                    [c(177, 60, 30, 40), 0.0],
                    [c(faceColor.red * 255, faceColor.green * 255, faceColor.blue * 255, 0), 0.5],
                ],
                radial: true,
            },
            origin: forehead_shadow.position,
            destination: forehead_shadow.bounds.rightCenter,
        }
    });

    // face drop shadow
    var shoulder = getItem("shoulder");
    getItem("face-shadow").strokeWidth = 0;
    var faceShadow = getItem("face-shadow").scale(2.6).toPath();
    faceShadow.strokeWidth = 0;
    var faceShadowGrad = new Gradient(
        [   // stops
            [c(177, 60, 30, 30), 0.0],
            [c(faceColor.red * 255, faceColor.green * 255, faceColor.blue * 255, 0), 0.6],
        ],
        true   // radial
    );
    faceShadow.fillColor = new Color(
        faceShadowGrad,
        faceShadow.position,   // origin
        faceShadow.bounds.rightCenter   // destination
    );
    var shoulderClip = shoulder.clone();
    var shoulderGroup = new Group([shoulderClip, shoulder, faceShadow]);
    shoulderGroup.clipped = true;
    shoulderGroup.insertBelow(faceGroup);

    ["neck-l", "neck-r"].forEach(function(item) {
        getItem(item).insertBelow(faceGroup);
        getItem(item).insertAbove(shoulderGroup);
    });

    ["l", "r"].forEach(function(direction, i) {

        var iris_x = 0;
        var iris_y = 1;

        var _iris = getItem("iris-" + direction);
        _iris.position = _iris.position.add(iris_x, iris_y);
        // clip iris by sclera
        var _sclera = getItem("sclera-" + direction);
        //_sclera.selected = true;
        //_iris.selected = true;

        var iris = _iris.intersect(_sclera);
        iris.position = iris.position.add(0, -1);
        _iris.visible = false;

        var sclera_shadow = getItem("sclera-" + direction);
        var ratio = (i == 0) ? -1: 1;

        sclera_shadow.strokeColor = null;
        sclera_shadow.strokeWidth = 0;
        sclera_shadow.fillColor = c(210, 200, 200);

        var sclera_tmp = sclera_shadow.clone().scale(1.0);
        var sclera_tmp2 = sclera_shadow.clone().scale(1.0);

        sclera_tmp.rotate(ratio * 5);
        sclera_tmp.scale(1.06, 1.12);
        //sclera_tmp.position = sclera_tmp.position.add(ratio * -10, 17);
        sclera_tmp.position = sclera_tmp.position.add(ratio * -6, 15);
        var sclera = sclera_shadow.intersect(sclera_tmp);
        sclera.fillColor = c(250, 250, 250);
        sclera_tmp.visible = false;

        var pos = iris.position.add(0, iris.bounds.height * 0.4);
        var iris_bottom = new Path.Circle({    // [FIXME] rename `bottom`
            center: pos,
            radius: iris.bounds.height * 1.1
        });
        iris_bottom.set({
            fillColor: {
                gradient: {
                    stops: [   // stops
                        [c(245, 254, 255, 170), 0.03],
                        [c(195, 224, 225, 170), 0.09],
                        [c( 72, 134, 175, 170), 0.118],
                        [c( 71, 81, 132,  170), 0.137],
                        [c( 71, 81, 132,  170), 0.190],
                        [c( 81,115, 142,  170), 0.240],
                        [c( 61, 61, 62,   110), 0.26],
                    ],
                    radial: true,
                },
                origin: iris_bottom.position.add((i ==0) ? 0: -2, (i == 0) ? 17: 17),
                destination: iris_bottom.bounds.rightCenter,
            }
        });
        iris_bottom.scale(3.9, 1.0);
        var iris_bottom_clip = iris.clone().scale(0.99).scale(0.97, 0.93);
        iris_bottom_clip.position = iris_bottom_clip.position.add(ratio * -0.5, 2);
        var iris_bottom_group = new Group(iris_bottom_clip, iris_bottom);
        iris_bottom_group.clipped = true;
        iris_bottom_group.position = iris_bottom_group.position.add(0, 0);
        //iris_bottom_group.visible = false;

        iris.set({
            strokeWidth: 2,
            strokeColor: c(45, 55, 55, 120),
            fillColor: {
                gradient: {
                    stops: [
                        [c(195, 205, 235, 230), 0.07],
                        [c(125, 135, 165, 230), 0.37],
                        [c(34, 46, 126,   190), 0.88],
                        [c(12, 23, 46,   190), 0.97],
                    ],
                    radial: true,
                },
                origin: iris.bounds.bottomCenter.add(-1, -1),
                destination: iris.bounds.topCenter,
            }
        });

        function pupilColor(obj, alpha) {
            var base = c(60, 65, 95, alpha);
            var base2 = base.clone();
            base2.saturation = base2.saturation + 0.05;
            base2.alpha = base2.alpha * 0.88;
            return {
                gradient: {
                    stops: [
                        [base, 1.0],
                        [base2, 0.0],
                    ],
                    radial: true
                },
                origin: obj.bounds.bottomCenter,
                destination: obj.bounds.topCenter
            };
        }

        var R = 0.8;
        var pw = 0.21, ph = 0.25;
        var iw = iris.bounds.width, ih = iris.bounds.height;
        var xd = (i > 0) ? -3: 3;

        var pupilb = new Path.Ellipse({
            //point: iris.position.add(-4 + i * -5, -6),
            point: iris.position.add(- pw * R * 0.5 * iw + xd, -ph * R * 0.5 * ih + 2),
            size: iris.bounds.scale(pw * R, ph * R)
        });
        pupilb.fillColor = pupilColor(pupilb, 120);

        var pupil = new Path.Ellipse({
            //point: iris.position.add(-4 + i * -5, -9),
            point: iris.position.add(- pw * R * 0.5 * iw + xd, -ph * R * 0.5 * ih + 4),
            size: iris.bounds.scale(pw * R, ph * R)
        });
        pupil.fillColor = pupilColor(pupil, 210);

        var faceRotation = 3.0;
        var angle = (i == 0) ? ratio * 1.1: ratio * (4.7 + faceRotation - 0.3);
        pupilb.rotate(angle);
        pupil.rotate(angle);

        var irisAll = new Group([
            iris,
            iris_bottom_group,
            pupilb,
            pupil,
        ]);

        var highlights = [
            {l: new Point(-15, -19), r: new Point(-15, -22), radius: 7, fillColor: c(255, 255, 255, 255)},
            //{l: new Point( 16, -13), r: new Point(13,  -12), radius: 3, fillColor: c(255, 255, 255, 245)},
            {l: new Point( 22,  19), r: new Point( 19,  19), radius: 3, fillColor: c(255, 255, 255, 255)},
        ];

        highlights.forEach(function(obj) {
            var pos = (i == 0) ? obj.l: obj.r;
            var path = new Path.Circle({
                radius: obj.radius,
                fillColor: obj.fillColor,
                position: iris.position.add(pos)
            });
            irisAll.addChild(path);
        });

        var irisGroup = new Group([sclera_tmp2, irisAll]);
        irisGroup.clipped = true;

        var upper_lash_line = getItem("upper-lash-line-" + direction);
        var stop_ratio = (i == 0) ? 0.3 : 0.7;
        upper_lash_line.fillColor = {
            gradient: {
                stops: [
                    [c(190, 96, 88, 220), 0],
                    [c(56, 56, 58, 240), stop_ratio],
                    [c(190, 96, 88, 220), 1],
                ],
            },
            origin: upper_lash_line.bounds.leftCenter,
            destination: upper_lash_line.bounds.rightCenter  // destination
        };
        upper_lash_line.strokeWidth = 0;
        upper_lash_line.insertAbove(irisGroup);
    });

}

Character.prototype.setup = function() {
    this.face();
};

Character.prototype.face = function() {
    /*
    var hw = new HandwrittenBezierPath();
    var hw_func = hw.distortContinuously(2, 3, true);   // amp, div, fill, stroke
    */
};

Character.prototype.draw = function() {

};


/* --- main --- */
//var character = new Character("Chino", {}, {});
//character.setup();
