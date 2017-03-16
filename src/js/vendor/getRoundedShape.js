function getRoundedShape(points, r) {
	var sb = [];
	var r_2_squared = 4*r*r;

	for(var i = 0, len = points.length; i<len; i++) {
		var before_i = i === 0 ? len - 1 : i-1;
		var after_i = i === len - 1 ? 0 : i+1;

		var p1 = points[before_i]; var p1x = p1[0]; var p1y = p1[1];
		var p2 = points[i]; var p2x = p2[0]; var p2y = p2[1];
		var p3 = points[after_i]; var p3x = p3[0]; var p3y = p3[1];

		var t1 = Math.atan2(p1y-p2y,p1x-p2x);
		var t2 = Math.atan2(p3y-p2y,p3x-p2x);

			
		var p1p2dx = p2x - p1x; var p1p2dy = p2y - p1y; var p1_p2_dist_squared = p1p2dx*p1p2dx + p1p2dy*p1p2dy;
		var p1p2r = p1_p2_dist_squared > r_2_squared ? r : Math.sqrt(p1_p2_dist_squared) / 2.0;
		var dx_before_p2 = p1p2r * Math.cos(t1);
		var dy_before_p2 = p1p2r * Math.sin(t1);

		var p2p3dx = p3x - p2x; var p2p3dy = p3y - p2y; var p2_p3_dist_squared = p2p3dx*p2p3dx + p2p3dy*p2p3dy;
		var p2p3r = p2_p3_dist_squared > r_2_squared ? r : Math.sqrt(p2_p3_dist_squared) / 2.0;
		var dx_after_p2 = p2p3r * Math.cos(t2);
		var dy_after_p2 = p2p3r * Math.sin(t2);

		var dx_after_p1 = -dx_before_p2;
		var dy_after_p1 = -dy_before_p2;

		var p1_p3_dy = p1y-p3y;
		var p1_p3_dx = p1x-p3x;
		var p1_p3_dist_squared = p1_p3_dy * p1_p3_dy + p1_p3_dx * p1_p3_dx;


		if(i === 0) {
			var move_command = ["M", p1x + dx_after_p1, p1y + dy_after_p1];
			sb.push.apply(sb, move_command);
		}
		var line_command = ["L", p2x + dx_before_p2, p2y + dy_before_p2];
		var curve_command = ["S", p2x, p2y, p2x + dx_after_p2, p2y + dy_after_p2];

		sb.push.apply(sb, line_command);
		sb.push.apply(sb, curve_command);
	}
	return sb.join(" ");
}

export default getRoundedShape