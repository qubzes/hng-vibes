import logging as logging_module

from app.core.config import settings

COLORS = {
    "INFO": "\033[32m",  # Green
    "WARNING": "\033[33m",  # Yellow
    "ERROR": "\033[31m",  # Red
    "CRITICAL": "\033[41m",  # Red background
    "RESET": "\033[0m",  # Reset
}


class ColorFormatter(logging_module.Formatter):
    def __init__(self, fmt: str | None = None) -> None:
        super().__init__(fmt)
        self.max_length = max(len(name) for name in COLORS.keys() if name != "RESET")
        self.base_fmt = fmt or "%(levelname)s: %(message)s"

    def format(self, record: logging_module.LogRecord) -> str:
        # Calculate padding for this specific record
        color = COLORS.get(record.levelname, COLORS["RESET"])
        level_name = record.levelname
        padding = " " * (self.max_length - len(level_name))

        # Create a temporary copy of the record to avoid mutating shared state
        colored_level = f"{color}{level_name}{COLORS['RESET']}"
        formatted_msg = f"{colored_level}:{padding} {record.getMessage()}"

        # Build the log record manually without mutating formatter state
        return formatted_msg


def setup_logger() -> logging_module.Logger:
    logger = logging_module.getLogger(__name__)
    logger.setLevel(logging_module.DEBUG if settings.DEBUG else logging_module.INFO)

    handler = logging_module.StreamHandler()
    handler.setFormatter(ColorFormatter("%(levelname)s: %(message)s"))
    logger.addHandler(handler)
    return logger


logging = setup_logger()
