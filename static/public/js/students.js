var showAllStudentsBtn = $('#btn-showAllStudents');
console.log(showAllStudentsBtn);
showAllStudentsBtn.click(function (event) {
  console.log("button pressed")
  getStudents();
});

function getStudents() {
  $.getJSON("/Students/all", function (data) {
    var table = $("#resultsTable");
    var tableHead = $('#tablehead');
    document.getElementById('resultsTable').innerHTML = "";
    document.getElementById('tablehead').innerHTML = "";
    tableHead.append(
        "<th>StudentID</th><th>First Name</th>" +
        "<th>Last Name</th><th>Date of Birth</th>" +
        "<th>GPA</th>" +
        "<th>Edit</th><th>Delete</th>");
    $.each(data, function (ID, StudentObject) {
      var rowData = $('<tr></tr>');
      rowData.append("<td>" + StudentObject.StudentID + "</td>");
      rowData.append("<td>" + StudentObject.Fname + "</td>");
      rowData.append("<td>" + StudentObject.Lname + "</td>");
      rowData.append("<td>" + StudentObject.DOB + "</td>");
      rowData.append("<td>" + StudentObject.GPA + "</td>");
      rowData.append("<td><button type='submit' class='btn btn-info' onclick='editStudent("
          + StudentObject.StudentID + ")'>Edit</button></td>");
      rowData.append("<td><button type='submit' class='btn btn-info'onclick='deleteStudent("
          + StudentObject.StudentID + ")'>Delete</button></td>");
      table.append(rowData);
    });
  });
}

function editStudent(StudentID) {
  window.location.href = "/editStudent/" + StudentID;
}

function deleteStudent(StudentID) {
  console.log("Delete Student");
  window.location.href = "/deleteStudent/" + StudentID;
}
