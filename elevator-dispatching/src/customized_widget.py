from PyQt6.QtWidgets import QWidget, QSlider, QPlainTextEdit
from PyQt6 import QtCore, QtGui
from typing import*


class Slider(QSlider):

    def wheelEvent(self, e: QtGui.QWheelEvent) -> None: ...
    def mouseMoveEvent(self, ev: QtGui.QMouseEvent) -> None: ...
    def mousePressEvent(self, ev: QtGui.QMouseEvent) -> None: ...


class LogBoard(QWidget):

    viewArea: QPlainTextEdit

    def __init__(self, parent: Optional['QWidget'] = ..., flags: QtCore.Qt.WindowType = ...) -> None:
        super().__init__()
        self.initUI()

    def initUI(self):
        self.viewArea = QPlainTextEdit(self)
        self.viewArea.setGeometry(10, 20, 300, 500)
        self.viewArea.setFont(QtGui.QFont('Microsoft YaHei', 15))

    def write(self, text):
        cursor = self.viewArea.textCursor()
        cursor.movePosition(QtGui.QTextCursor.MoveOperation.End)
        cursor.insertText(text + '\n')
        self.viewArea.setTextCursor(cursor)
        self.viewArea.ensureCursorVisible()
