from functools import partial
from PyQt6.QtCore import pyqtSignal, Qt
from PyQt6.QtGui import *
from PyQt6.QtWidgets import *
from typing import *
from math import ceil
from customized_widget import*


class ElevatorView(QWidget):

    logger = pyqtSignal(str)

    def __init__(self, numElevator, numFloor, inDestSetter, pauseSwitch, doorOpener, exDestUpSetter, exDestDownSetter):
        super().__init__()
        self.initUI(numElevator, numFloor, inDestSetter, pauseSwitch,
                    doorOpener, exDestUpSetter, exDestDownSetter)
        self.logger.connect(self.logBoard.write)

    def initUI(self, numElevator, numFloor, inDestSetter, pauseSwitch, doorOpener, exDestUpSetter, exDestDownSetter):

        globalLayout = QHBoxLayout()
        gridR = QGridLayout()
        gridL = QGridLayout()
        gridL.setSpacing(10)
        gridR.setSpacing(10)
        vbox = QVBoxLayout()

        gridContainerL = QWidget()
        gridContainerR = QWidget()
        vboxContainer = QWidget()
        logLabel = QLabel('  电梯日志  ')
        logLabel.setFont(QFont('Microsoft YaHei', 26))
        self.logBoard = LogBoard()

        gridContainerR.setObjectName("gcr")
        gridContainerL.setLayout(gridL)
        gridContainerR.setLayout(gridR)
        vboxContainer.setLayout(vbox)
        vbox.addWidget(logLabel)
        vbox.addWidget(self.logBoard, Qt.AlignmentFlag.AlignTop)
        self.logBoard.setMinimumWidth(310)
        self.logBoard.setMaximumWidth(310)
        globalLayout.addWidget(gridContainerL)
        globalLayout.addWidget(gridContainerR)
        globalLayout.addWidget(vboxContainer)
        self.setLayout(globalLayout)
        names = [f'{i}' for i in range(1, 1 + numFloor)]
        positions = [(i, j) for j in range(2)
                     for i in range(ceil(numFloor / 2))]
        if numFloor % 2 == 1:
            positions.pop()

        '''右侧布局'''
        for i in range(numElevator):
            for j, (position, name) in enumerate(zip(positions, names)):
                if name == '':
                    continue
                btn = QPushButton(name)
                btn.setFont(QFont("Microsoft YaHei", 12))
                btn.setObjectName("{0}+{1}".format(i + 1, j + 1))
                btn.clicked.connect(partial(inDestSetter, i + 1, j + 1))
                btn.setMaximumHeight(40)
                gridR.addWidget(btn, position[0] + 5, position[1] + i * 3 + 1)

            lcd = QLCDNumber()
            lcd.setObjectName("{0}".format(i + 1))
            gridR.addWidget(lcd, 0, 3 * i + 1, 2, 2)

            btn = QPushButton("暂停")
            btn.setFont(QFont("Microsoft YaHei", 12))
            btn.setObjectName("pause{0}".format(i + 1))
            btn.setMinimumHeight(30)
            btn.clicked.connect(partial(pauseSwitch, i + 1))
            gridR.addWidget(btn, 4, 3 * i + 1, 1, 2)

            btn = QPushButton("开门")
            btn.setFont(QFont("Microsoft YaHei", 12))
            btn.setObjectName("pause{0}".format(i + 1))
            btn.setMinimumHeight(30)
            btn.clicked.connect(partial(doorOpener, i + 1))
            gridR.addWidget(btn, 3, 3 * i + 1, 1, 2)

            lab = QLabel()
            lab.setObjectName("open{0}".format(i + 1))
            lab.setStyleSheet(
                f"#open{i + 1}" + "{image:url(resources/elevator_closed.png); image-position:center;}")
            lab.setMinimumHeight(150)
            lab.setMaximumHeight(150)
            gridR.addWidget(lab, 2, 3 * i + 1, 1, 2)

            lab = QLabel()
            lab.setObjectName(f"dir{i + 1}")
            lab.setStyleSheet(
                f"#dir{i + 1}" + "{image:url(resources/elevator_stop.png); image-position:center;}")
            lab.setMinimumWidth(40)
            lab.setMaximumWidth(40)
            gridR.addWidget(lab, 0, 3 * i + 1, 2, 1)

            sld = Slider(Qt.Orientation.Vertical)
            sld.setObjectName("sld{0}".format(i + 1))
            gridR.addWidget(sld, 0, 3 * i, 2 + ceil(numFloor / 2), 1)

        for i in range(gridR.rowCount()):
            gridR.setRowMinimumHeight(i, 40)

        '''左侧布局'''
        for flr in range(1, 1 + numFloor):
            lbl = QLabel(f"level {flr}")
            lbl.setFont(QFont("Microsoft YaHei"))
            lbl.setMinimumHeight(30)
            gridL.addWidget(lbl, numFloor - flr + 1, 0)

        for idx in range(numFloor):
            btn = QPushButton('▲')
            btn.setFont(QFont("Microsoft YaHei"))
            btn.setObjectName("up{0}".format(idx + 1))
            btn.setMinimumHeight(30)
            btn.clicked.connect(partial(exDestUpSetter, idx + 1))
            gridL.addWidget(btn, numFloor - idx, 1)

        for idx in range(numFloor):
            btn = QPushButton('▼')
            btn.setFont(QFont("Microsoft YaHei"))
            btn.setObjectName("down{0}".format(idx + 1))
            btn.setMinimumHeight(30)
            btn.clicked.connect(partial(exDestDownSetter, idx + 1))
            gridL.addWidget(btn, numFloor - idx, 2)


class MainView(QMainWindow):
    elevatorView: ElevatorView

    def __init__(self, numElevator, numFloor, inDestSetter, pauseSwitch, doorOpener, exDestUpSetter, exDestDownSetter) -> None:
        super().__init__()
        self.elevatorView = ElevatorView(numElevator, numFloor, inDestSetter,
                                          pauseSwitch, doorOpener, exDestUpSetter, exDestDownSetter)
        self.setCentralWidget(self.elevatorView)
        self.setStyleSheet(
            ".QWidget{background-color: qlineargradient(x1:0, y1:0, x2:1, y2:0,stop:0 rgba(185, 232, 255, 180),stop:0.5 rgba(200, 234, 239, 200),stop:1 rgba(185, 232, 255, 180));}")
        self.setWindowTitle("电梯调度 @1951477 孟宇")
