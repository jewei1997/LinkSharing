pytest \
    --ignore-glob='env/*.py' \
    --disable-pytest-warnings \
    --cov-report term-missing \
    --cov-branch \
    --cov-config=.coveragerc \
    --cov=linksharing\
    --cov=linklist\
    --cov=users\
