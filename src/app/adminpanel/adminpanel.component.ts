import { Component, OnInit} from '@angular/core';
import { QuestionService } from '../question.service';
import { StudentsService } from '../students.service';
import { TestconfigService } from '../testconfig.service';
import { TestConfig } from '../TestConfig';
import { Student } from '../student';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Router } from '@angular/router';

declare var M: any;

declare var $: any;

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.css']
})
export class AdminpanelComponent implements OnInit{

  questions: any[][] = new Array();
  students: Student[] = new Array();
  config: TestConfig;

  search: string;
  filter: number = 0;

  selectedStudent: Student;
  editingStudent: boolean;

  hoverID: number = -1;

  panelSelect: number = 1;
  option: string = 'Test Settings';
  totalMarks: number;
  fren10501060: number;
  fren10601505: number;
  fren15052506: number;
  quizTime: number;
  qID: number = 0;
  pID: number = 0;
  sideNav: any;
  editing: number = 0;
  eQuestion: any;
  load: boolean = false;

  constructor(private questionService: QuestionService, private studentService: StudentsService, private router: Router, private testService: TestconfigService) { }

  ngOnInit() {
    try {
      this.students = this.studentService.getStudents();
      this.questions = this.questionService.getQuestions();
      this.config = this.testService.getConfig();
      //(this.config.medianMark);
      this.fren10501060 = this.config.medianMark[0];
      this.fren10601505 = this.config.medianMark[1];
      this.fren15052506 = this.config.medianMark[2];
      this.quizTime = this.config.quizTime / 60;
      this.totalMarks = this.calTotalMarks(5);
      this.load = true;
      this.initJquery();
    } catch(e) {
      this.router.navigate(['/intro']);
    }
  }

  changeID(id?: number) {
    if(id) {
      this.hoverID = id
    } else {
      this.hoverID = -1;
    }
  }

  changePanel(panel: number) {
    if(this.panelSelect == panel)
      return;
    if(this.editing)
      this.complete(true);
    if(this.editingStudent)
      this.complete2(true);
    this.panelSelect = panel;
    switch(panel) {
      case 1:
        this.option = 'Test Settings';
        break;
      case 2:
        this.option = 'Questions';
        break;
      case 3:
        this.option = 'Students';
        break;
      default:
        this.option = 'Error';
        break;
    }
    $(function() {
      M.updateTextFields();
      $('.fixed-action-btn').floatingActionButton();
      $('.tooltipped').tooltip();
      $(window).scrollTop(0);
      $('select').formSelect();
    });
  }



  select(qID: number, pID: number) {

    if(qID != this.qID) {
      this.qID = qID;
    }
    if(pID != this.pID) {
      this.pID = pID;
    }
    $('.modal').modal();
    $('.collapsible').collapsible();
  }

  calTotalQuestions(part: number): number {
    let total: number = 0;
    let start: number = (part == 5) ? 0 : 3;
    for(let j = start; j < this.questions.length; j++) {
      for(let i = 0; i < this.questions[((part == 5) ? j + 1: part) - 1].length; i++) {
        total++;
      }
    }
    return total;
  }

  calTotalMarks(part: number):number {
    let total: number = 0;
    let start: number = (part == 5) ? 0 : 3;
    for(let j = start; j < this.questions.length; j++) {
      for(let i = 0; i < this.questions[((part == 5) ? j + 1: part) - 1].length; i++) {
        total = total + (((part == 2 || part == 4) || ((j == 1 || j == 3) && part == 5)) ? this.calculateMarks(this.questions[((part == 5) ? j + 1: part) - 1][i].marks) : parseInt(this.questions[((part == 5) ? j + 1: part) - 1][i].marks));
      }
    }
    return total;
  }

  editQuestion(qID: number, part: number) {
    $(".tooltipped").each(function() {
      M.Tooltip.getInstance($(this)).close();
    });
    this.editing = part;
    this.eQuestion = this.questions[part - 1][qID];
    this.panelSelect = 0;
    $(window).scrollTop(0);
  }

  newQuestion(part: number) {
    $(".tooltipped").each(function() {
      M.Tooltip.getInstance($(this)).close();
    });
    this.eQuestion = null;
    this.editing = part;
    this.panelSelect = 0;
    $(window).scrollTop(0);

  }

  editStudent(id: number) {
    this.hoverID = -1;
    this.selectedStudent = this.students[id];
    this.editingStudent = true;
    this.panelSelect = 0;
    $(window).scrollTop(0);
  }

  complete(done: boolean) {
    this.questions = this.questionService.getQuestions();
    this.initJquery();
    this.panelSelect = 2;
    if(done) {
      this.editing = 0;
      this.eQuestion = null;
    }
  }

  complete2(done: boolean) {
    this.students = this.studentService.getStudents();
    this.initJquery();
    this.panelSelect = 3;
    if(done) {
      this.editingStudent = false;
      this.selectedStudent = null;
    }
  }

  calculateMarks(arr: any[]) {
    let total = 0;
    for(let i = 0; i < arr.length; i++) {
      total += parseInt(arr[i]);
    }
    return total;
  }

  initJquery() {
    $(document).ready(function(){
      $('.sidenav').sidenav();
      this.sideNav = M.Sidenav.getInstance($('#slide-out'));
      M.updateTextFields();
      $('.modal').modal();
      $('.collapsible').collapsible();
      $('.fixed-action-btn').floatingActionButton();
      $('.tooltipped').tooltip();
      $('select').formSelect();
    });
  }

  saveConfig() {
    this.config.quizTime = this.quizTime * 60;
    this.config.medianMark[0] = this.fren10501060;
    this.config.medianMark[1] = this.fren10601505;
    this.config.medianMark[2] = this.fren15052506;
    this.testService.saveNewConfig(this.config);
  }

  filterTable() {
    //if(!this.search)
      //return;
    let table, tr, td, i, input;
    table = document.getElementById('studentTable');
    tr = table.getElementsByTagName("tr");
    if(!this.search)
      input = this.search;
    else
      input = this.search.toUpperCase();


    for(i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td')[this.filter];
      if(td) {
        if(td.innerHTML.toUpperCase().indexOf(input) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  sortTable(n) {
    let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("studentTable");
    switching = true;

    dir = "asc";

    while (switching) {

      switching = false;
      rows = table.getElementsByTagName("TR");

      for (i = 1; i < (rows.length - 1); i++) {

        shouldSwitch = false;

        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];

        if (dir == "asc") {
          if(Number(x.innerHTML)) {
            if (Number(x.innerHTML) > Number(y.innerHTML)) {

              shouldSwitch = true;
              break;
            }
          } else {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {

              shouldSwitch = true;
              break;
            }
          }
        } else if (dir == "desc") {
          if(Number(x.innerHTML)) {
            if (Number(x.innerHTML) < Number(y.innerHTML)) {

              shouldSwitch = true;
              break;
            }
          } else {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {

              shouldSwitch = true;
              break;
            }
          }
        }
      }
      if (shouldSwitch) {

        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;

        switchcount ++;
      } else {

        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }

}
