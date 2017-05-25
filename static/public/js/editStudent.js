$(document).ready(function () {
	var href = window.location.href;
	var splitString = href.split("/");
	var StudentID = splitString[splitString.length -1];
	getStudentObject(StudentID);
})

function getStudentObject(StudentID) {
	$.getJSON("/getStudent/" + StudentID, function (data) {
		var StudentObject = data[0];
		$("#StudentID").val(StudentObject.StudentID);
		$("#StudentFname").val(StudentObject.StudentFname);
		$("#StudentLname").val(StudentObject.StudentLname);
		$("#StudentDOB").val(StudentObject.StudentDOB);
	});
}
