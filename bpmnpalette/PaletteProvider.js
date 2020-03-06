import {
  assign
} from 'min-dash';


/**
 * A palette provider for BPMN 2.0 elements.
 */
export default function PaletteProvider(
    palette, create, elementFactory,
    spaceTool, lassoTool, handTool,
    globalConnect, translate) {

  this._palette = palette;
  this._create = create;
  this._elementFactory = elementFactory;
  this._spaceTool = spaceTool;
  this._lassoTool = lassoTool;
  this._handTool = handTool;
  this._globalConnect = globalConnect;
  this._translate = translate;

  palette.registerProvider(this);
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'globalConnect',
  'translate'
];


PaletteProvider.prototype.getPaletteEntries = function(element) {

  var actions = {},
      create = this._create,
      elementFactory = this._elementFactory,
      spaceTool = this._spaceTool,
      lassoTool = this._lassoTool,
      handTool = this._handTool,
      globalConnect = this._globalConnect,
      translate = this._translate;

  function createAction(type, group, className, title, options) {

    function createListener(event) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded;
      }

      create.start(event, shape);
    }

    var shortType = type.replace(/^bpmn:/, '');

    return {
      group: group,
      className: className,
      title: title || translate('Create {type}', { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener
      }
    };
  }

  function createSubprocess(event) {
    var subProcess = elementFactory.createShape({
      type: 'bpmn:SubProcess',
      x: 0,
      y: 0,
      isExpanded: true
    });

    var startEvent = elementFactory.createShape({
      type: 'bpmn:StartEvent',
      x: 40,
      y: 82,
      parent: subProcess
    });

    create.start(event, [ subProcess, startEvent ], {
      hints: {
        autoSelect: [ startEvent ]
      }
    });
  }


  function createConnection(sourceShape, targetShape, waypoints,parentSubprocess) //添加连接线
  {
	return elementFactory.createConnection({
        	type:'bpmn:SequenceFlow',
        	source:sourceShape,
		target: targetShape,
		waypoints:waypoints,
    parent:parentSubprocess});
  }
 
  function createPattern4(event) {    //Pattern4： Diagnosis-Action

    var task1 = elementFactory.createShape({
      type: 'bpmn:BusinessRuleTask',
      x: 60,
      y: 60
    });

    var gateway = elementFactory.createShape({                                    
      type: 'bpmn:ExclusiveGateway',
      x: 200,
      y: 75
    });

    var task2 = elementFactory.createShape({
      type: 'bpmn:Task',
      x: 300,
      y: 60
    });

    var task3 = elementFactory.createShape({
      type: 'bpmn:Task',
      x: 300,
      y: 160
    });

     var task4 = elementFactory.createShape({
      type: 'bpmn:Task',
      x: 300,
      y: -40
    });

    var connection1 = createConnection(task1,gateway ,[{x:160, y:100}, {x:200, y:100}]);
    var connection2 = createConnection(gateway, task2 ,[{x:250, y:100}, {x:300, y:100}]);
    var connection3 = createConnection(gateway, task3 ,[{x:225, y:125},{x:225, y:200}, {x:300, y:200}]);
    var connection4 = createConnection(gateway, task4 ,[{x:225, y:125},{x:225, y:0}, {x:300, y:0}]);

    create.start(event, [ task1, gateway, task2, task3, task4, connection1, connection2, connection3,connection4], {
      hints: {
        autoSelect: [ task1 ]
      }
    });        
  }

 function createPattern1(event) {  // pattern1： 周期活动


    var subPro = elementFactory.createShape({
      type: 'bpmn:SubProcess',
      x: 220,
      y: 30,
      isExpanded: true
    });

    var startEvent = elementFactory.createShape({
      type: 'bpmn:StartEvent',
      x: 230,
      y: 120,
      parent: subPro
    });

    var timer1 = elementFactory.createShape({
    
      type: 'bpmn:IntermediateCatchEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition',
      x: 300,
      y: 120,
      parent: subPro
    });
      
      var medicalTask = elementFactory.createShape({
      type: 'bpmn:Task',
      x: 360,
      y: 100,
      parent: subPro
    });

      var timer2 = elementFactory.createShape({
      type: 'bpmn:IntermediateCatchEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition',
      x: 500,
      y: 120,
      parent: subPro
    });
      

      var boundryEvent = elementFactory.createShape({
       type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition',
      x: 550,
      y: 160,
      host: subPro
    
        });
    var connection1 = createConnection(startEvent,timer1 ,[{x:265, y:140}, {x:300, y:140}], subPro);
    var connection2 = createConnection(timer1, medicalTask ,[{x:330, y:140}, {x:360, y:140}],subPro);
    var connection3 = createConnection(medicalTask,timer2 ,[{x:460, y:140}, {x:500, y:140}],subPro);
    var connection4 = createConnection(timer2, medicalTask ,[{x:520, y:130}, {x:520, y:80}, {x:410, y:80}, {x:410, y:100}],subPro);

    create.start(event, [subPro,startEvent, timer1,medicalTask,timer2,connection1,connection2,connection3,connection4,boundryEvent], {
      hints: {
        autoSelect: [ subPro ]
      }
    });
  }
 
 function createPattern2(event) {  // pattern2： reaching goal within valid period
    var subPro = elementFactory.createShape({
      type: 'bpmn:SubProcess',
      x: 280,
      y: 50,
      width:400,
      height:360,
      isExpanded: true
    });

    var startEvent = elementFactory.createShape({
      type: 'bpmn:StartEvent',
      x: 300,
      y: 120,
      parent: subPro
    });

      var medicalTask = elementFactory.createShape({
      type: 'bpmn:Task',
      x: 360,
      y: 100,
      parent: subPro
    });

      var exGetway = elementFactory.createShape({
      type: 'bpmn:ExclusiveGateway',
      x: 500,
      y: 115,
      parent: subPro
    });
       var endEvent = elementFactory.createShape({
      type: 'bpmn:EndEvent',
      x: 570,
      y: 120,
      parent: subPro
    });

      var boundryEvent = elementFactory.createShape({
       type: 'bpmn:BoundaryEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition',
      x: 660,
      y: 130,
      host: subPro
    
        });
      
 var task2 = elementFactory.createShape({
      type: 'bpmn:Task',
      x: 730,
      y: 110     
    });

    var exGetway2 = elementFactory.createShape({
      type: 'bpmn:ExclusiveGateway',
      x: 730,
      y: 275,
    });
   
   var task3 = elementFactory.createShape({
      type: 'bpmn:Task',
      x: 800,
      y: 265,
    });
   var task4 = elementFactory.createShape({
      type: 'bpmn:Task',
      x: 720,
      y: 350,
    });


   var subPro2 = elementFactory.createShape({
      type: 'bpmn:SubProcess',
      x: 290,
      y: 200,
      isExpanded: true,
      triggeredByEvent: true,
      parent: subPro
    });

   var startEvent2 = elementFactory.createShape({
      type: 'bpmn:StartEvent',
      eventDefinitionType: 'bpmn:TimerEventDefinition',
      x: 320,
      y: 280,
      parent: subPro2
    });

    var medicalTask2 = elementFactory.createShape({
      type: 'bpmn:Task',
      x: 400,
      y: 260,
      parent: subPro2
    });


 var endEvent2 = elementFactory.createShape({
      type: 'bpmn:EndEvent',
      x: 530,
      y: 280,
      parent: subPro2
    });

    subPro2.triggeredByEvent=true;
    var connection2 = createConnection(startEvent, medicalTask ,[{x:330, y:140}, {x:360, y:140}],subPro);
    var connection3 = createConnection(medicalTask,exGetway ,[{x:460, y:140}, {x:500, y:140}],subPro);
    var connection4 = createConnection(exGetway, medicalTask ,[{x:520, y:130}, {x:520, y:80}, {x:410, y:80}, {x:410, y:100}],subPro);
    var connection5 = createConnection(exGetway ,endEvent, [{x:550, y:140}, {x:570, y:140}],subPro);
    var connection6= createConnection(startEvent2 ,medicalTask2, [{x:350, y:300}, {x:410, y:300}],subPro2);
    var connection7 = createConnection(medicalTask2 ,endEvent2, [{x:490, y:300}, {x:530, y:300}],subPro2);

    var connection8 = createConnection(boundryEvent ,task2, [{x:680, y:150}, {x:730, y:150}]);  
     var connection9= createConnection(subPro ,exGetway2, [{x:680, y:300}, {x:730, y:300}]);  
      var connection10= createConnection(exGetway2 ,task3, [{x:780, y:300}, {x:800, y:300}]);  
       var connection11= createConnection(exGetway2 ,task4, [{x:755, y:320}, {x:755, y:360}]);  

   create.start(event, [subPro,startEvent,medicalTask,exGetway,connection2,connection3,connection4,boundryEvent,endEvent,connection5,subPro2,startEvent2,medicalTask2,endEvent2,connection6,connection7,task2,connection8,exGetway2,connection9,task3,task4,connection10,connection11], {
      hints: {

        autoSelect: [ subPro ]
      }
    });
  }



  function createParticipant(event) {
    create.start(event, elementFactory.createParticipantShape());
  }

  assign(actions, {
    'hand-tool': {
      group: 'tools',
      className: 'bpmn-icon-hand-tool',
      title: translate('Activate the hand tool'),
      action: {
        click: function(event) {
          handTool.activateHand(event);
        }
      }
    },
    'lasso-tool': {
      group: 'tools',
      className: 'bpmn-icon-lasso-tool',
      title: translate('Activate the lasso tool'),
      action: {
        click: function(event) {
          lassoTool.activateSelection(event);
        }
      }
    },
    'space-tool': {
      group: 'tools',
      className: 'bpmn-icon-space-tool',
      title: translate('Activate the create/remove space tool'),
      action: {
        click: function(event) {
          spaceTool.activateSelection(event);
        }
      }
    },
    'global-connect-tool': {
      group: 'tools',
      className: 'bpmn-icon-connection-multi',
      title: translate('Activate the global connect tool'),
      action: {
        click: function(event) {
          globalConnect.toggle(event);
        }
      }
    },
    'tool-separator': {
      group: 'tools',
      separator: true
    },
    'create.start-event': createAction(
      'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none',
      translate('Create StartEvent')
    ),
    'create.intermediate-event': createAction(
      'bpmn:IntermediateThrowEvent', 'event', 'bpmn-icon-intermediate-event-none',
      translate('Create Intermediate/Boundary Event')
    ),
    'create.end-event': createAction(
      'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none',
      translate('Create EndEvent')
    ),
    'create.exclusive-gateway': createAction(
      'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-none',
      translate('Create Gateway')
    ),
    'create.task': createAction(
      'bpmn:Task', 'activity', 'bpmn-icon-task',
      translate('Create Task')
    ),
    'create.data-object': createAction(
      'bpmn:DataObjectReference', 'data-object', 'bpmn-icon-data-object',
      translate('Create DataObjectReference')
    ),
    'create.data-store': createAction(
      'bpmn:DataStoreReference', 'data-store', 'bpmn-icon-data-store',
      translate('Create DataStoreReference')
    ),
    'create.subprocess-expanded': {
      group: 'activity',
      className: 'bpmn-icon-subprocess-expanded',
      title: translate('Create expanded SubProcess'),
      action: {
        dragstart: createSubprocess,
        click: createSubprocess
      }
    },
    'create.participant-expanded': {
      group: 'collaboration',
      className: 'bpmn-icon-participant',
      title: translate('Create Pool/Participant'),
      action: {
        dragstart: createParticipant,
        click: createParticipant
      }
    },

    /*
    'create.group': createAction(
      'bpmn:Group', 'artifact', 'bpmn-icon-group',
      translate('Create Group')
    ),
  */


      'create.pattern0': {      // 占位
      group: 'activity2',
      className: 'bpmn-icon-p0',
      title: translate('Periodic Activity Pattern'),
      action: {
      dragstart: createPattern1,
        click: createPattern1
      }
    },

      'create.pattern1': {      // 周期活动模式 pattern 1
      group: 'activity2',
      className: 'bpmn-icon-p1',
      title: translate('Periodic Activity Pattern'),
      action: {
      dragstart: createPattern1,
        click: createPattern1
      }
    },
   
    'create.pattern2': {      // pattern 2 還沒實現
      group: 'activity2',
      className: 'bpmn-icon-p2',
      title: translate('Periodic Activity Pattern'),
      action: {
      dragstart: createPattern2,
        click: createPattern2
      }
    },

/*
 'create.pattern3': {      // pattern 3  还没实现
      group: 'activity2',
      className: 'bpmn-icon-p3',
      title: translate('Periodic Activity Pattern'),
      action: {
      dragstart: createPattern1,
        click: createPattern1
      }
    },
*/
    'create.pattern4': {          // 决策分支模式
      group: 'activity4',
      className: 'bpmn-icon-p4',
      title: translate('Decision-Action Pattern'),
      action: {
	dragstart: createPattern4,
        click: createPattern4
      }
    },
/*
    'create.pattern5': {      // pattern 5  还没实现
      group: 'activity2',
      className: 'bpmn-icon-p5',
      title: translate('Periodic Activity Pattern'),
      action: {
      dragstart: createPattern1,
        click: createPattern1
      }
    },
    'create.pattern6': {      // pattern 6  还没实现
      group: 'activity2',
      className: 'bpmn-icon-p6',
      title: translate('Periodic Activity Pattern'),
      action: {
      dragstart: createPattern1,
        click: createPattern1
      }
    },
    'create.pattern7': {      // pattern 7  还没实现
      group: 'activity2',
      className: 'bpmn-icon-p7',
      title: translate('Periodic Activity Pattern'),
      action: {
      dragstart: createPattern1,
        click: createPattern1
      }
    },
    */
  });

  return actions;
};
