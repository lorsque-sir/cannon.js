var Vec3 =     require("../src/math/Vec3")
,   Quaternion = require("../src/math/Quaternion")
,   Plane =      require('../src/shapes/Plane')
,   Trimesh =      require('../src/shapes/Trimesh')
,   World =      require('../src/world/World')
,   Body =      require('../src/objects/Body')

module.exports = {
    computeNormals: function(test){
        var mesh = makeTorus();
        mesh.normals[0] = 1;
        mesh.computeNormals();
        test.ok(mesh.normals[0] !== 1);
        test.done();
    },

    getVertex: function(test){
        var mesh = makeTorus();
        var vertex = new Vec3();
        mesh.getVertex(0, vertex);
        test.deepEqual(vertex, new Vec3(mesh.vertices[0], mesh.vertices[1], mesh.vertices[2]));
        test.done();
    },

    getWorldVertex: function(test){
        var mesh = makeTorus();
        var vertex = new Vec3();
        mesh.getWorldVertex(0, new Vec3(), new Quaternion(), vertex);
        test.deepEqual(vertex, new Vec3(mesh.vertices[0], mesh.vertices[1], mesh.vertices[2]));
        test.done();
    },

    getTriangleVertices: function(test){
        var mesh = makeTorus();
        var va = new Vec3();
        var vb = new Vec3();
        var vc = new Vec3();
        var va1 = new Vec3();
        var vb1 = new Vec3();
        var vc1 = new Vec3();
        mesh.getVertex(mesh.indices[0], va);
        mesh.getVertex(mesh.indices[1], vb);
        mesh.getVertex(mesh.indices[2], vc);
        mesh.getTriangleVertices(0, va1, vb1, vc1);
        test.deepEqual(va, va1);
        test.deepEqual(vb, vb1);
        test.deepEqual(vc, vc1);
        test.done();
    },

    getNormal: function(test){
        var mesh = makeTorus();
        var normal = new Vec3();
        mesh.getNormal(0, normal);
        test.deepEqual(new Vec3(mesh.normals[0], mesh.normals[1], mesh.normals[2]), normal);
        test.done();
    },

    calculateLocalInertia: function(test){
        var mesh = makeTorus();
        var inertia = new Vec3();
        mesh.calculateLocalInertia(1,inertia);
        test.done();
    },

    computeLocalAABB: function(test){
        console.warn('Trimesh::computeLocalAABB is todo');
        test.done();
    },

    updateBoundingSphereRadius: function(test){
        console.warn('Trimesh::updateBoundingSphereRadius is todo');
        test.done();
    },


    calculateWorldAABB : function(test){
        var poly = makeTorus();
        var min = new Vec3();
        var max = new Vec3();
        poly.calculateWorldAABB(new Vec3(1,0,0), // Translate 2 x in world
                                new Quaternion(0,0,0,1),
                                min,
                                max);
        test.ok(!isNaN(min.x));
        test.ok(!isNaN(max.x));
        test.done();
    },

    volume: function(test){
        var mesh = makeTorus();
        test.ok(mesh.volume() > 0);
        test.done();
    },

    narrowphaseAgainstPlane: function(test){
        var world = new World();

        var torusShape = makeTorus();
        var torusBody = new Body({
            mass: 1
        });
        torusBody.addShape(torusShape);

        var planeBody = new Body({
            mass: 1
        });
        planeBody.addShape(new Plane());

        world.addBody(torusBody);
        world.addBody(planeBody);

        world.step(1 / 60);

        test.done();
    }
};

/**
 *
 */
function makeTorus(radius, tube, radialSegments, tubularSegments, arc) {
    radius = radius || 100;
    tube = tube || 40;
    radialSegments = radialSegments || 8;
    tubularSegments = tubularSegments || 6;
    arc = arc || Math.PI * 2;

    var vertices = [];
    var indices = [];

    for ( var j = 0; j <= radialSegments; j ++ ) {
        for ( var i = 0; i <= tubularSegments; i ++ ) {
            var u = i / tubularSegments * arc;
            var v = j / radialSegments * Math.PI * 2;

            var x = ( radius + tube * Math.cos( v ) ) * Math.cos( u );
            var y = ( radius + tube * Math.cos( v ) ) * Math.sin( u );
            var z = tube * Math.sin( v );

            vertices.push( x, y, z );
        }
    }

    for ( var j = 1; j <= radialSegments; j ++ ) {
        for ( var i = 1; i <= tubularSegments; i ++ ) {
            var a = ( tubularSegments + 1 ) * j + i - 1;
            var b = ( tubularSegments + 1 ) * ( j - 1 ) + i - 1;
            var c = ( tubularSegments + 1 ) * ( j - 1 ) + i;
            var d = ( tubularSegments + 1 ) * j + i;

            indices.push(a, b, d);
            indices.push(b, c, d);
        }
    }

    return new Trimesh(vertices, indices);
};